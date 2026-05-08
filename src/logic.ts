import type { Game, Player, Round, Setup, Snapshot, SettledPlayer, Payment } from './types';

export const WINDS = ['東', '南', '西', '北'];

export function buildGame(setup: Setup): Game {
  const n = setup.mode === 'sanma' ? 3 : 4;
  const s = { ...setup, n };
  return {
    setup: s,
    players: s.players.slice(0, n).map((p, i) => ({
      name: p || `プレイヤー${i + 1}`,
      score: s.startScore,
      scored: false,
    })),
    round: { wind: 0, kyoku: 0, honba: 0, riichiSticks: 0 },
    history: [],
    finished: false,
  };
}

export function snapshotGame(g: Game): Snapshot {
  return JSON.parse(JSON.stringify({ players: g.players, round: g.round }));
}

export function restoreGame(g: Game, snap: Snapshot): Game {
  return { ...g, players: snap.players, round: snap.round };
}

export function totalKyoku(setup: Setup): number {
  if (setup.mode === 'tonpu') return 4;
  if (setup.mode === 'sanma') return 4;
  return 8;
}

export function dealerOf(round: Round, n: number): number {
  return round.kyoku % n;
}

export function roundLabel(round: Round, setup: Setup): string {
  return `${WINDS[round.wind]}${round.kyoku + 1}局`;
}

function clonePlayers(players: Player[]): Player[] {
  return players.map(p => ({ ...p }));
}

export function applyTsumo(
  g: Game,
  winnerIdx: number,
  koPay: number,
  oyaPay: number,
  riichiPlayers: number[],
): Game {
  const newG: Game = { ...g, players: clonePlayers(g.players), round: { ...g.round } };
  const dealer = dealerOf(g.round, g.setup.n);

  riichiPlayers.forEach(i => { newG.players[i].score -= 1000; });
  newG.round.riichiSticks += riichiPlayers.length;

  let total = 0;
  newG.players.forEach((p, i) => {
    if (i === winnerIdx) return;
    const pay = i === dealer ? oyaPay : koPay;
    p.score -= pay;
    total += pay;
  });
  const honbaPay = 100 * newG.round.honba;
  newG.players.forEach((p, i) => {
    if (i === winnerIdx) return;
    p.score -= honbaPay;
    total += honbaPay;
  });
  newG.players[winnerIdx].score += total + newG.round.riichiSticks * 1000;
  newG.players[winnerIdx].scored = true;
  newG.round.riichiSticks = 0;

  return advanceRound(newG, winnerIdx === dealer);
}

export function applyRon(
  g: Game,
  winnerIdx: number,
  loserIdx: number,
  points: number,
  riichiPlayers: number[],
): Game {
  const newG: Game = { ...g, players: clonePlayers(g.players), round: { ...g.round } };
  const dealer = dealerOf(g.round, g.setup.n);

  riichiPlayers.forEach(i => { newG.players[i].score -= 1000; });
  newG.round.riichiSticks += riichiPlayers.length;

  const honbaPay = 300 * newG.round.honba;
  newG.players[loserIdx].score -= points + honbaPay;
  newG.players[winnerIdx].score += points + honbaPay + newG.round.riichiSticks * 1000;
  newG.players[winnerIdx].scored = true;
  newG.round.riichiSticks = 0;

  return advanceRound(newG, winnerIdx === dealer);
}

export function applyRyukyoku(
  g: Game,
  tenpaiFlags: boolean[],
  riichiPlayers: number[],
): Game {
  const newG: Game = { ...g, players: clonePlayers(g.players), round: { ...g.round } };

  riichiPlayers.forEach(i => { newG.players[i].score -= 1000; });
  newG.round.riichiSticks += riichiPlayers.length;

  const tenpai = tenpaiFlags.map((t, i) => t ? i : -1).filter(x => x >= 0);
  const noten = tenpaiFlags.map((t, i) => !t ? i : -1).filter(x => x >= 0);
  if (tenpai.length > 0 && noten.length > 0) {
    const perTenpai = Math.floor(3000 / tenpai.length);
    const perNoten = Math.floor(3000 / noten.length);
    tenpai.forEach(i => { newG.players[i].score += perTenpai; });
    noten.forEach(i => { newG.players[i].score -= perNoten; });
  }

  const dealer = dealerOf(g.round, g.setup.n);
  return advanceRound(newG, tenpaiFlags[dealer], true);
}

export function applyOverwrite(g: Game, scores: number[], dealerKeep = false): Game {
  const newG = { ...g, players: g.players.map((p, i) => ({ ...p, score: scores[i] })) };
  return advanceRound(newG, dealerKeep);
}

function advanceRound(g: Game, dealerKeep: boolean, ryukyoku = false): Game {
  const newG: Game = { ...g, round: { ...g.round } };
  if (ryukyoku) {
    newG.round.honba += 1;
    if (!dealerKeep) newG.round.kyoku += 1;
  } else {
    if (dealerKeep) {
      newG.round.honba += 1;
    } else {
      newG.round.honba = 0;
      newG.round.kyoku += 1;
    }
  }
  const total = totalKyoku(g.setup);
  if (newG.round.kyoku >= g.setup.n && newG.round.wind === 0 && total > g.setup.n) {
    newG.round.wind = 1;
    newG.round.kyoku = 0;
  }
  const kyokuPassed = newG.round.wind * g.setup.n + newG.round.kyoku;
  if (kyokuPassed >= total) newG.finished = true;
  if (g.setup.tobi && newG.players.some(p => p.score < 0)) newG.finished = true;
  return newG;
}

export function settle(g: Game): SettledPlayer[] {
  const { players, setup } = g;
  const n = setup.n;
  const ranked = players
    .map((p, i) => ({ ...p, idx: i }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx);

  const okaTotal = setup.oka ? (setup.returnScore - setup.startScore) * n / 1000 : 0;
  const umaArr = computeUma(setup, n);

  const final: SettledPlayer[] = ranked.map((p, rank) => ({
    ...p,
    rank: rank + 1,
    raw: (p.score - setup.returnScore) / 1000,
    oka: rank === 0 ? okaTotal : 0,
    uma: umaArr[rank],
    tobi: 0,
    yakitori: 0,
    total: (p.score - setup.returnScore) / 1000 + (rank === 0 ? okaTotal : 0) + umaArr[rank],
  }));

  if (setup.tobi) {
    final.forEach(p => {
      if (p.score < 0) { p.tobi -= setup.tobiAmount; p.total -= setup.tobiAmount; }
    });
    const givers = final.filter(p => p.score < 0).length;
    if (givers > 0) {
      final[0].tobi += setup.tobiAmount * givers;
      final[0].total += setup.tobiAmount * givers;
    }
  }

  if (setup.yakitori) {
    final.forEach(p => {
      if (!p.scored) { p.yakitori -= setup.yakitoriAmount; p.total -= setup.yakitoriAmount; }
    });
    const losers = final.filter(p => !p.scored).length;
    const winners = final.filter(p => p.scored).length;
    if (losers > 0 && winners > 0) {
      const share = setup.yakitoriAmount * losers / winners;
      final.forEach(p => {
        if (p.scored) { p.yakitori += share; p.total += share; }
      });
    }
  }

  return final;
}

function computeUma(setup: Setup, n: number): number[] {
  const u = setup.uma;
  if (n === 3) {
    if (u === '10-30') return [+20, 0, -20];
    if (u === '5-10') return [+10, 0, -10];
    if (u === 'none') return [0, 0, 0];
    return setup.umaCustom.slice(0, 3);
  }
  if (u === '10-30') return [+30, +10, -10, -30];
  if (u === '5-10') return [+10, +5, -5, -10];
  if (u === 'none') return [0, 0, 0, 0];
  return setup.umaCustom.slice(0, 4);
}

export function calcFuScore(
  han: number,
  fu: number,
  isDealer: boolean,
): { ron: number; koPay: number; oyaPay: number } {
  const raw = fu * Math.pow(2, han + 2);
  let basic: number;
  if (han >= 13) basic = 8000;
  else if (han >= 11) basic = 6000;
  else if (han >= 8) basic = 4000;
  else if (han >= 6) basic = 3000;
  else if (han >= 5 || raw >= 2000) basic = 2000;
  else basic = raw;
  const ru = (n: number) => Math.ceil(n / 100) * 100;
  return {
    ron: isDealer ? ru(basic * 6) : ru(basic * 4),
    koPay: ru(basic * 2),
    oyaPay: isDealer ? ru(basic * 2) : ru(basic * 4),
  };
}

export function minimizePayments(final: SettledPlayer[]): Payment[] {
  const txs: Payment[] = [];
  const creditors = final.filter(p => p.total > 0.001).map(p => ({ name: p.name, amount: p.total }));
  const debtors = final.filter(p => p.total < -0.001).map(p => ({ name: p.name, amount: -p.total }));
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);
    if (pay > 0.001) txs.push({ from: debtors[i].name, to: creditors[j].name, amount: pay });
    debtors[i].amount -= pay;
    creditors[j].amount -= pay;
    if (debtors[i].amount < 0.001) i++;
    if (creditors[j].amount < 0.001) j++;
  }
  return txs;
}

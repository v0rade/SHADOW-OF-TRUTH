import type { EvidenceManager } from './EvidenceManager';
import type { DeductionEngine } from './DeductionEngine';

export interface BoardCard {
  id: string;
  type: 'evidence' | 'suspect' | 'hypothesis';
  refId: string; // evidenceId or suspectId or custom
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoardConnection {
  id: string;
  cardAId: string;
  cardBId: string;
  status: 'hypothesis' | 'confirmed' | 'contradicted';
  deductionId?: string;
}

export class InvestigationBoard {
  private cards: Map<string, BoardCard> = new Map();
  private connections: Map<string, BoardConnection> = new Map();

  constructor() {}

  public addCard(card: BoardCard): void {
    this.cards.set(card.id, card);
  }

  public moveCard(id: string, x: number, y: number): boolean {
    const card = this.cards.get(id);
    if (card) {
      card.x = x;
      card.y = y;
      return true;
    }
    return false;
  }

  public getCards(): BoardCard[] {
    return Array.from(this.cards.values());
  }

  public getCard(id: string): BoardCard | undefined {
    return this.cards.get(id);
  }

  public connectCards(
    cardAId: string,
    cardBId: string,
    deductionEngine?: DeductionEngine
  ): { success: boolean; connection?: BoardConnection; message: string } {
    if (cardAId === cardBId) {
      return { success: false, message: 'Cannot connect a card to itself.' };
    }

    const cardA = this.cards.get(cardAId);
    const cardB = this.cards.get(cardBId);
    if (!cardA || !cardB) {
      return { success: false, message: 'Card not found on board.' };
    }

    // Check if connection already exists
    for (const conn of this.connections.values()) {
      if (
        (conn.cardAId === cardAId && conn.cardBId === cardBId) ||
        (conn.cardAId === cardBId && conn.cardBId === cardAId)
      ) {
        return { success: false, message: 'Connection already exists between these cards.' };
      }
    }

    const connId = `conn_${cardAId}_${cardBId}`;
    let status: 'hypothesis' | 'confirmed' | 'contradicted' = 'hypothesis';
    let deductionId: string | undefined;
    let message = 'Thread pinned between clues.';

    if (deductionEngine && cardA.type === 'evidence' && cardB.type === 'evidence') {
      const dedResult = deductionEngine.testDeduction(cardA.refId, cardB.refId);
      if (dedResult.success && dedResult.rule) {
        status = 'confirmed';
        deductionId = dedResult.rule.id;
        message = `Breakthrough: ${dedResult.rule.resultingFact}`;
      } else {
        message = dedResult.message;
      }
    }

    const newConn: BoardConnection = {
      id: connId,
      cardAId,
      cardBId,
      status,
      deductionId
    };

    this.connections.set(connId, newConn);
    return { success: true, connection: newConn, message };
  }

  public removeConnection(connId: string): boolean {
    return this.connections.delete(connId);
  }

  public getConnections(): BoardConnection[] {
    return Array.from(this.connections.values());
  }

  public syncWithCollectedEvidence(evidenceManager: EvidenceManager): void {
    const collected = evidenceManager.getAllCollected();
    let col = 0;
    let row = 0;
    const startX = 60;
    const startY = 100;
    const spacingX = 180;
    const spacingY = 120;
    const maxCols = 4;

    for (const item of collected) {
      const cardId = `card_ev_${item.id}`;
      if (!this.cards.has(cardId)) {
        this.addCard({
          id: cardId,
          type: 'evidence',
          refId: item.id,
          title: item.name,
          x: startX + col * spacingX,
          y: startY + row * spacingY,
          width: 150,
          height: 80
        });

        col++;
        if (col >= maxCols) {
          col = 0;
          row++;
        }
      }
    }
  }

  public serialize(): { cards: BoardCard[]; connections: BoardConnection[] } {
    return {
      cards: Array.from(this.cards.values()),
      connections: Array.from(this.connections.values())
    };
  }

  public deserialize(data: { cards: BoardCard[]; connections: BoardConnection[] }): void {
    this.cards.clear();
    this.connections.clear();
    for (const c of data.cards) {
      this.cards.set(c.id, c);
    }
    for (const cn of data.connections) {
      this.connections.set(cn.id, cn);
    }
  }
}

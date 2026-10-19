import { LocationScene } from './LocationScene';

export class OfficeScene extends LocationScene {
  constructor() {
    super();
  }

  public override init(): void {
    super.init({ locationId: 'loc_office' });
  }
}

import { LocationScene } from './LocationScene';

export class CrimeScene extends LocationScene {
  constructor() {
    super();
  }

  public override init(): void {
    super.init({ locationId: 'loc_crime_scene' });
  }
}

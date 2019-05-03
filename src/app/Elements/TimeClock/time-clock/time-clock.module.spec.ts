import { TimeClockModule } from './time-clock.module';

describe('TimeClockModule', () => {
  let timeClockModule: TimeClockModule;

  beforeEach(() => {
    timeClockModule = new TimeClockModule();
  });

  it('should create an instance', () => {
    expect(timeClockModule).toBeTruthy();
  });
});

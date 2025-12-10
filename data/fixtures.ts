import { Fixture } from '../types';
import { groupFixtures } from './groupFixtures';
import { knockoutFixtures } from './knockoutFixtures';

export const wcFixtures: Fixture[] = [...groupFixtures, ...knockoutFixtures];
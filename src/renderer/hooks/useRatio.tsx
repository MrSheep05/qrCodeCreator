import { useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';

type Aspect = [string, string];

const valueFromRatio = (ratio: String): { height: string; width: string } => {
  const values = ratio.split(':');
  const proportion = 80 / parseInt(values[0]);
  return { height: `${proportion * parseInt(values[1])}vmin`, width: '80vmin' };
};

const useRatio = (isHorizontal: Boolean): Aspect => {
  const { selectedRatio } = useContext(AppState).state;
  const { width, height } = valueFromRatio(selectedRatio);
  return isHorizontal ? [width, height] : [height, width];
};

export default useRatio;

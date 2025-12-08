import { Playground } from './Playground';
import showdown from 'showdown';

// exception as this is the application entry point
// eslint-disable-next-line import/no-default-export
export default function App() {

  // bootstrap github markdown flavor
  showdown.setFlavor('github');

  return <Playground />;
}

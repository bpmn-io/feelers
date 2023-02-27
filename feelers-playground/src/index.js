import Playground from './Playground'
import showdown from 'showdown';


export default function App() {

	// bootstrap github markdown flavor
	showdown.setFlavor('github');

	return <Playground />;

}

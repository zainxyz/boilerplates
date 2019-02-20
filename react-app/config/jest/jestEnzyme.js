import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure `enzyme` with the new React 16.x adapter.
configure({ adapter: new Adapter() });

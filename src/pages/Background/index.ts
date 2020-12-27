import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { registerOnTabOpenHook } from './onOpenTab';
import { registerOnVisitPageHook } from './onVisitPage';
import { PageHistory } from '../../history';
import { registerOnWillOpenPageHook } from './willOpenPage';

console.log('Background script started...');

const history = new PageHistory();

function main() {
    registerOnTabOpenHook()
    registerOnVisitPageHook()
    registerOnWillOpenPageHook()
}

main()
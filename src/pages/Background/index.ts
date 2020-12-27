import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { registerOnTabOpenHook } from './onOpenTab';
import { registerOnVisitPageHook } from './onVisitPage';
import { registerOnWillOpenPageHook } from './willOpenPage';

console.log('Background script started...');

function main() {
    registerOnTabOpenHook()
    registerOnVisitPageHook()
    registerOnWillOpenPageHook()
}

main()
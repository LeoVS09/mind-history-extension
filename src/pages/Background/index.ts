import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { registerOnTabOpenHook } from './onOpenTab';
import { registerOnVisitPageHook } from './onVisitPage';

console.log('Background script started...');

function main() {
    registerOnTabOpenHook()
    registerOnVisitPageHook()
}

main()
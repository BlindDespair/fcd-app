import { fromEvent } from 'rxjs';
import { publish, refCount } from 'rxjs/operators';

export const windowClick$ = fromEvent(window, 'click').pipe(publish(), refCount());

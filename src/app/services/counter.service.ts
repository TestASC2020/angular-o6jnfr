import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class CounterService {
    private counterSource = new Subject<number>();
    counter = this.counterSource.asObservable();

    updateCounter(count: number) {
        this.counterSource.next(count);
    }
}

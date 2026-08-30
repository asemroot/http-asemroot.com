import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { SEARCH_QUEUE } from './search.queue.js';

@Processor(SEARCH_QUEUE)
export class SearchProcessor extends WorkerHost {

    async process(job: Job<any>): Promise<void> {

        switch (job.name) {

            case 'index-user':

                console.log(job.data);

                break;

            case 'update-user':

                console.log(job.data);

                break;

            case 'delete-user':

                console.log(job.data);

                break;

        }

    }

}

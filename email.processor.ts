import { Worker } from 'bullmq';

export const emailWorker = new Worker(
  'emailQueue',
  async job => {
    console.log('Processing email job:', job.id, job.data);

    // هنا تحط الشغل التقيل
    await sendEmail(job.data);

    return { status: 'done' };
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
);

async function sendEmail(data) {
  // هنا بقى تبعت الإيميل فعلاً
  await new Promise(res => setTimeout(res, 500));
  console.log('Email sent to:', data.to);
}

import { useVideoTaskStore } from '~/stores/videoTask';
import { useNuxtApp } from 'nuxt/app';
import { upload, createTasks } from '~/api/index';

export function useGeneration() {
  const videoTaskStore = useVideoTaskStore();
  const { $toast } = useNuxtApp() as any;

  const generate = async (params: any) => {
    // 1. Start the progress bar immediately
    videoTaskStore.startTask(
      null,
      params.speed as 'relaxed' | 'fast' | 'turbo',
      params.mode as 'text-to-image' | 'image-to-image' | 'ai-video'
    );

    try {
      // 2. Handle image upload if necessary
      let file_url = '';
      if ((params.mode === 'image-to-image' || params.mode === 'ai-video') && params.imageFile) {
        const uploadResponse = await upload({ file: params.imageFile }) as any;
        if (uploadResponse.code === 200) {
          file_url = uploadResponse.data;
        } else {
          $toast.error(uploadResponse.msg || 'Image upload failed.');
          videoTaskStore.clearCurrentTask();
          return;
        }
      }

      // 3. Prepare and create the generation task
      const taskParams: any = {
        prompt: params.prompt,
        file_url: file_url,
        speed: params.speed,
        ratio: params.aspectRatio,
        stylization: params.stylization,
        weirdness: params.weirdness,
      };

      if (params.mode === 'ai-video') {
        taskParams.task_type = 'video';
      } else if (params.mode === 'image-to-image') {
        taskParams.task_type = 'mj_imagine';
      } else {
        taskParams.task_type = 'mj';
      }

      const response = await createTasks(taskParams) as any;
      if (response.code === 200) {
        // $toast.success('Task created successfully!');
        videoTaskStore.setTaskId(response.data.task_id);
      } else {
        $toast.error(response.msg || 'Failed to create task.');
        videoTaskStore.clearCurrentTask();
      }
    } catch (error: any) {
      console.error('Generation failed:', error);
      $toast.error(error.msg || 'An unexpected error occurred.');
      videoTaskStore.clearCurrentTask();
    }
  };

  return {
    generate,
  };
}

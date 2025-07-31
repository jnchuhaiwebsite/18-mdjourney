import { useVideoTaskStore } from '~/stores/videoTask';
import { useNuxtApp } from 'nuxt/app';
import { upload, createTasks } from '~/api/index';

export function useGeneration() {
  const videoTaskStore = useVideoTaskStore();
  const { $toast } = useNuxtApp() as any;

  const generate = async (params: any) => {
    console.log('🚀 useGeneration.generate 开始执行，参数:', params);
    
    // 1. Start the progress bar immediately
    console.log('📊 开始任务进度条');
    videoTaskStore.startTask(
      null,
      params.speed as 'relaxed' | 'fast' | 'turbo',
      params.mode as 'text-to-image' | 'image-to-image' | 'ai-video'
    );

    try {
      // 2. Handle image upload if necessary
      let file_url = '';
      if ((params.mode === 'image-to-image' || params.mode === 'ai-video') && params.imageFile) {
        console.log('📤 开始上传图片文件');
        const uploadResponse = await upload({ file: params.imageFile }) as any;
        console.log('📤 图片上传响应:', uploadResponse);
        if (uploadResponse.code === 200) {
          file_url = uploadResponse.data;
          console.log('✅ 图片上传成功, URL:', file_url);
        } else {
          console.error('❌ 图片上传失败:', uploadResponse);
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
        taskParams.task_type = 'mj_video';
      } else if (params.mode === 'image-to-image') {
        taskParams.task_type = 'mj_img2img';
      } else {
        taskParams.task_type = 'mj_txt2img';
      }

      console.log('🔄 准备创建任务，参数:', taskParams);
      const response = await createTasks(taskParams) as any;
      // const response = {
      //   code: 200,
      //   data: {
      //     task_id: '63b76e9ae93d0839dc4a02227c71ae31'
      //   }
      // }
      console.log('🔄 创建任务响应:', response);
      
      if (response.code === 200) {
        console.log('✅ 任务创建成功, task_id:', response.data.task_id);
        videoTaskStore.setTaskId(response.data.task_id);
        // videoTaskStore.setTaskId('d1164bb195dbf8e627a51819bf5b19a7');
      } else {
        console.error('❌ 任务创建失败:', response);
        $toast.error(response.msg || 'Failed to create task.');
        videoTaskStore.clearCurrentTask();
      }
    } catch (error: any) {
      console.error('💥 生成过程出错:', error);
      $toast.error(error.msg || 'An unexpected error occurred.');
      videoTaskStore.clearCurrentTask();
    }
  };

  return {
    generate,
  };
}

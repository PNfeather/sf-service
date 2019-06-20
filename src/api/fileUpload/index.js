import {Http} from '@/plugins/http';

// 上传文件
export const fileUpload = (data) => {
  let formData = new FormData();
  let keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    formData.append(keys[i], data[keys[i]]);
  }
  return Http.post('/file/upload', formData);
};

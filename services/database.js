import { f } from './firebase';

export const saveRun = () => {
  f.database()
    .ref('users/' + 'ben')
    .set({
      highscore: 100
    });
};

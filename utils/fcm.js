import messaging from '@react-native-firebase/messaging';

export default async function generateFCMToken(userId) {
  const fcmToken = await messaging().getToken();
  return await fetch('http://esrs.herokuapp.com/api/auth/token/user', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      user_id: userId,
    },
    body: JSON.stringify({
      fcm_token: fcmToken,
      date_created: new Date().toString(),
    }),
  });
}

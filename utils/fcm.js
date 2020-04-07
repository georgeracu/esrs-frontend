import messaging from '@react-native-firebase/messaging';

export default async function generateFCMToken(userId) {
  const fcmToken = await messaging().getToken();
  return await fetch(
    `https://esrs-staging.herokuapp.com/api/auth/user/${userId}/token`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fcm_token: fcmToken,
        date_created: new Date().toString(),
      }),
    },
  );
}

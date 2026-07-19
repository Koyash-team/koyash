// Avatar catalogue for the profile picker (Figma «Выбор профиля» 2828:1036).
// Keys are stored on the user (backend `avatar` field); images live in
// assets/account/avatars/.
import av01 from '../../assets/account/avatars/avatar-01.webp';
import av02 from '../../assets/account/avatars/avatar-02.webp';
import av03 from '../../assets/account/avatars/avatar-03.webp';
import av04 from '../../assets/account/avatars/avatar-04.webp';
import av05 from '../../assets/account/avatars/avatar-05.webp';
import av06 from '../../assets/account/avatars/avatar-06.webp';
import av07 from '../../assets/account/avatars/avatar-07.webp';
import av08 from '../../assets/account/avatars/avatar-08.webp';
import av09 from '../../assets/account/avatars/avatar-09.webp';
import av10 from '../../assets/account/avatars/avatar-10.webp';
import av11 from '../../assets/account/avatars/avatar-11.webp';
import av12 from '../../assets/account/avatars/avatar-12.webp';
import av13 from '../../assets/account/avatars/avatar-13.webp';
import av14 from '../../assets/account/avatars/avatar-14.webp';
import av15 from '../../assets/account/avatars/avatar-15.webp';
import av16 from '../../assets/account/avatars/avatar-16.webp';
import av17 from '../../assets/account/avatars/avatar-17.webp';
import av18 from '../../assets/account/avatars/avatar-18.webp';
import av19 from '../../assets/account/avatars/avatar-19.webp';
import av20 from '../../assets/account/avatars/avatar-20.webp';

export const AVATARS = [
  { key: 'a1', src: av01 },
  { key: 'a2', src: av02 },
  { key: 'a3', src: av03 },
  { key: 'a4', src: av04 },
  { key: 'a5', src: av05 },
  { key: 'a6', src: av06 },
  { key: 'a7', src: av07 },
  { key: 'a8', src: av08 },
  { key: 'a9', src: av09 },
  { key: 'a10', src: av10 },
  { key: 'a11', src: av11 },
  { key: 'a12', src: av12 },
  { key: 'a13', src: av13 },
  { key: 'a14', src: av14 },
  { key: 'a15', src: av15 },
  { key: 'a16', src: av16 },
  { key: 'a17', src: av17 },
  { key: 'a18', src: av18 },
  { key: 'a19', src: av19 },
  { key: 'a20', src: av20 },
];

export const avatarSrc = (key) => (AVATARS.find((a) => a.key === key) || AVATARS[0]).src;

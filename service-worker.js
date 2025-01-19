// 서비스 워커 설치 이벤트
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
      // 캐시를 열고 중요한 파일들을 캐시합니다.
      caches.open('jun-coupang-cache').then((cache) => {
        console.log('Caching important files');
        return cache.addAll([
          '/',
          '/index.html', // 메인 HTML 파일
          '/style.css',  // 스타일 파일
          '/script.js',  // 자바스크립트 파일
          '/background.jpg', // 배경 이미지
          '/icon-192x192.png', // 192x192 아이콘
          '/icon-512x512.png', // 512x512 아이콘
          'https://coupa.ng/cg6dhp', // 외부 리소스 (예: 쿠팡 위젯)
          'https://ads-partners.coupang.com/widgets.html?id=831301&template=banner&trackingCode=AF9987936&subId=&width=728&height=90' // 외부 광고 배너
        ]);
      })
    );
  });
  
  // 서비스 워커 활성화 이벤트
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    // 새로운 서비스 워커가 이전의 캐시를 정리하거나 새로운 캐시를 적용할 수 있도록 처리
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 여기에서 버전 관리로 필요 없는 캐시를 삭제할 수 있음
            if (cacheName !== 'jun-coupang-cache') {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  // 서비스 워커 fetch 이벤트
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // 캐시된 응답이 있으면 반환, 없으면 네트워크에서 요청
        return cachedResponse || fetch(event.request).then((response) => {
          // 네트워크에서 받은 응답을 캐시에도 저장
          return caches.open('jun-coupang-cache').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });
  
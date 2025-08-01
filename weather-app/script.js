// WeatherAPI 설정
const API_KEY = 'd914ac4858f34c2196551103250108'; // WeatherAPI에서 발급받은 API 키를 입력하세요
const BASE_URL = 'https://api.weatherapi.com/v1';

// 한글 도시명을 영어로 변환하는 매핑
const cityMapping = {
    '서울': 'Seoul',
    '부산': 'Busan',
    '대구': 'Daegu',
    '인천': 'Incheon',
    '광주': 'Gwangju',
    '대전': 'Daejeon',
    '울산': 'Ulsan',
    '세종': 'Sejong',
    '제주': 'Jeju',
    '제주도': 'Jeju',
    '강릉': 'Gangneung',
    '춘천': 'Chuncheon',
    '청주': 'Cheongju',
    '전주': 'Jeonju',
    '포항': 'Pohang',
    '창원': 'Changwon',
    '수원': 'Suwon',
    '용인': 'Yongin',
    '고양': 'Goyang',
    '성남': 'Seongnam',
    '부천': 'Bucheon',
    '안산': 'Ansan',
    '안양': 'Anyang',
    '평택': 'Pyeongtaek',
    '시흥': 'Siheung',
    '김포': 'Gimpo',
    '광명': 'Gwangmyeong',
    '군포': 'Gunpo',
    '오산': 'Osan',
    '하남': 'Hanam',
    '이천': 'Icheon',
    '안성': 'Anseong',
    '의왕': 'Uiwang',
    '양평': 'Yangpyeong',
    '여주': 'Yeoju',
    '과천': 'Gwacheon',
    '구리': 'Guri',
    '남양주': 'Namyangju',
    '파주': 'Paju',
    '양주': 'Yangju',
    '포천': 'Pocheon',
    '연천': 'Yeoncheon',
    '가평': 'Gapyeong',
    '화성': 'Hwaseong',
    '동탄': 'Dongtan',
    '분당': 'Bundang',
    '판교': 'Pangyo',
    '일산': 'Ilsan',
    '운정': 'Unjeong',
    '마포': 'Mapo',
    '강남': 'Gangnam',
    '강북': 'Gangbuk',
    '강서': 'Gangseo',
    '강동': 'Gangdong',
    '종로': 'Jongno',
    '중구': 'Jung-gu',
    '용산': 'Yongsan',
    '성동': 'Seongdong',
    '광진': 'Gwangjin',
    '동대문': 'Dongdaemun',
    '중랑': 'Jungnang',
    '성북': 'Seongbuk',
    '강북': 'Gangbuk',
    '도봉': 'Dobong',
    '노원': 'Nowon',
    '은평': 'Eunpyeong',
    '서대문': 'Seodaemun',
    '마포': 'Mapo',
    '양천': 'Yangcheon',
    '강서': 'Gangseo',
    '구로': 'Guro',
    '금천': 'Geumcheon',
    '영등포': 'Yeongdeungpo',
    '동작': 'Dongjak',
    '관악': 'Gwanak',
    '서초': 'Seocho',
    '강남': 'Gangnam',
    '송파': 'Songpa',
    '강동': 'Gangdong'
};

// 날씨 아이콘 매핑
const weatherIcons = {
    'sunny': 'fas fa-sun',
    'clear': 'fas fa-sun',
    'partly cloudy': 'fas fa-cloud-sun',
    'cloudy': 'fas fa-cloud',
    'overcast': 'fas fa-cloud',
    'mist': 'fas fa-smog',
    'patchy rain possible': 'fas fa-cloud-rain',
    'patchy snow possible': 'fas fa-cloud-snow',
    'patchy sleet possible': 'fas fa-cloud-snow',
    'patchy freezing drizzle possible': 'fas fa-cloud-snow',
    'thundery outbreaks possible': 'fas fa-bolt',
    'blowing snow': 'fas fa-snowflake',
    'blizzard': 'fas fa-snowflake',
    'fog': 'fas fa-smog',
    'freezing fog': 'fas fa-smog',
    'patchy light drizzle': 'fas fa-cloud-rain',
    'light drizzle': 'fas fa-cloud-rain',
    'freezing drizzle': 'fas fa-cloud-snow',
    'heavy freezing drizzle': 'fas fa-cloud-snow',
    'patchy light rain': 'fas fa-cloud-rain',
    'light rain': 'fas fa-cloud-rain',
    'moderate rain at times': 'fas fa-cloud-rain',
    'moderate rain': 'fas fa-cloud-rain',
    'heavy rain at times': 'fas fa-cloud-showers-heavy',
    'heavy rain': 'fas fa-cloud-showers-heavy',
    'light freezing rain': 'fas fa-cloud-snow',
    'moderate or heavy freezing rain': 'fas fa-cloud-snow',
    'light sleet': 'fas fa-cloud-snow',
    'moderate or heavy sleet': 'fas fa-cloud-snow',
    'patchy light snow': 'fas fa-snowflake',
    'light snow': 'fas fa-snowflake',
    'patchy moderate snow': 'fas fa-snowflake',
    'moderate snow': 'fas fa-snowflake',
    'patchy heavy snow': 'fas fa-snowflake',
    'heavy snow': 'fas fa-snowflake',
    'ice pellets': 'fas fa-snowflake',
    'light rain shower': 'fas fa-cloud-rain',
    'moderate or heavy rain shower': 'fas fa-cloud-showers-heavy',
    'torrential rain shower': 'fas fa-cloud-showers-heavy',
    'light sleet showers': 'fas fa-cloud-snow',
    'moderate or heavy sleet showers': 'fas fa-cloud-snow',
    'light snow showers': 'fas fa-snowflake',
    'moderate or heavy snow showers': 'fas fa-snowflake',
    'light showers of ice pellets': 'fas fa-snowflake',
    'moderate or heavy showers of ice pellets': 'fas fa-snowflake',
    'patchy light rain with thunder': 'fas fa-bolt',
    'moderate or heavy rain with thunder': 'fas fa-bolt',
    'patchy light snow with thunder': 'fas fa-bolt',
    'moderate or heavy snow with thunder': 'fas fa-bolt'
};

// DOM 요소들
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const weatherContent = document.getElementById('weather-content');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// 이벤트 리스너 등록
searchBtn.addEventListener('click', searchWeather);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// 한글 도시명을 영어로 변환하는 함수
function convertCityName(input) {
    const trimmedInput = input.trim();
    
    // 한글 도시명 매핑에서 찾기
    if (cityMapping[trimmedInput]) {
        return cityMapping[trimmedInput];
    }
    
    // 영어로 직접 입력된 경우 그대로 반환
    return trimmedInput;
}

// 날씨 검색 함수
async function searchWeather() {
    const inputLocation = locationInput.value.trim();
    
    if (!inputLocation) {
        showError('도시명을 입력해주세요.');
        return;
    }

    showLoading();
    hideError();

    try {
        const englishLocation = convertCityName(inputLocation);
        const weatherData = await fetchWeatherData(englishLocation);
        displayWeather(weatherData);
    } catch (error) {
        console.error('날씨 데이터 가져오기 실패:', error);
        showError('날씨 정보를 가져올 수 없습니다. 도시명을 확인해주세요.');
    }
}

// WeatherAPI에서 데이터 가져오기
async function fetchWeatherData(location) {
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no`);
    
    if (!response.ok) {
        throw new Error('API 요청 실패');
    }
    
    return await response.json();
}

// 날씨 정보 표시
function displayWeather(data) {
    const { location, current, forecast } = data;
    
    const weatherHTML = `
        <div class="today-weather">
            <div class="location-info">
                <h2>${location.name}, ${location.country}</h2>
                <p>${location.localtime}</p>
            </div>
            
            <div class="current-weather">
                <div class="weather-icon">
                    <i class="${getWeatherIcon(current.condition.text)}"></i>
                </div>
                <div class="temperature">
                    ${Math.round(current.temp_c)}°C
                </div>
            </div>
            
            <div class="weather-details">
                <div class="weather-detail">
                    <i class="fas fa-thermometer-half"></i>
                    <h4>체감온도</h4>
                    <p>${Math.round(current.feelslike_c)}°C</p>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-tint"></i>
                    <h4>습도</h4>
                    <p>${current.humidity}%</p>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-wind"></i>
                    <h4>풍속</h4>
                    <p>${current.wind_kph} km/h</p>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-eye"></i>
                    <h4>가시거리</h4>
                    <p>${current.vis_km} km</p>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-compress-alt"></i>
                    <h4>기압</h4>
                    <p>${current.pressure_mb} mb</p>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-umbrella"></i>
                    <h4>강수확률</h4>
                    <p>${forecast.forecastday[0].day.daily_chance_of_rain}%</p>
                </div>
            </div>
        </div>
        
        <div class="weekly-forecast">
            <h3>7일 날씨 예보</h3>
            <div class="forecast-container">
                ${forecast.forecastday.map(day => `
                    <div class="forecast-day">
                        <h4>${formatDate(day.date)}</h4>
                        <div class="day-name">${getDayName(day.date)}</div>
                        <div class="weather-icon">
                            <i class="${getWeatherIcon(day.day.condition.text)}"></i>
                        </div>
                        <div class="temp">${Math.round(day.day.avgtemp_c)}°C</div>
                        <div class="temp-range">
                            ${Math.round(day.day.mintemp_c)}° / ${Math.round(day.day.maxtemp_c)}°
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    weatherContent.innerHTML = weatherHTML;
}

// 날씨 아이콘 가져오기
function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    return weatherIcons[conditionLower] || 'fas fa-cloud';
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

// 요일 이름 가져오기
function getDayName(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return '오늘';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return '내일';
    } else {
        return date.toLocaleDateString('ko-KR', { weekday: 'short' });
    }
}

// 로딩 표시
function showLoading() {
    loading.style.display = 'block';
    weatherContent.innerHTML = loading.outerHTML;
}

// 에러 메시지 표시
function showError(message) {
    errorMessage.style.display = 'block';
    errorMessage.querySelector('p').textContent = message;
    weatherContent.innerHTML = '';
}

// 에러 메시지 숨기기
function hideError() {
    errorMessage.style.display = 'none';
}

// 페이지 로드 시 기본 도시로 날씨 표시 (선택사항)
window.addEventListener('load', () => {
    // 기본 도시 설정 (서울)
    locationInput.value = '서울';
    searchWeather();
}); 
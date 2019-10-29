var point;
var activePolygon;
var map;

var $allLi;

ymaps.ready(init);

function init() {
    // Создать карту с центром в Мск
    map = new ymaps.Map("map", {
            center: [55.73, 37.75],
            zoom: 9
        });
    // Событие клика по карте
    map.events.add('click', function (e) {
        handleCoords(e.get('coords'));
    });

    // Загрузка страницы
    $(function(){
        // Настройка работы выбора КАД
        $allLi = $("#chooseKolco li");
        $allLi.click(function(){
            $allLi.removeClass('selected');
            $that = $(this);
            $that.addClass('selected');
            
            switch($that.text()){
                case "МКАД":
                    map.setCenter([55.73, 37.75]);
                    setActivePolygon("МКАД",mkadCoords);
                    break;
                case "Первое бетонное кольцо":
                    map.setCenter([55.73, 37.75]);
                    setActivePolygon("Первое бетонное кольцо",fbetCoords);
                    break;
                case "Второе бетонное кольцо":
                    map.setCenter([55.73, 37.75]);
                    setActivePolygon("Второе бетонное кольцо",sbetCoords);
                    break;
                case "КАД":
                    map.setCenter([59.939017, 30.312334]);
                    setActivePolygon("КАД",kadCoords);
                    break;
            }
        });
        $allLi.eq(0).trigger('click');
    });
}

// Провека на принадлежность Полигону
function testPolygon(coords) {
    alert(activePolygon.geometry.contains(coords)?"Принадлежит полигону":"Не принадлежит полигону");
}

// Создать объект метки на карте
function createPlacemark(coords) {
    var pnt = new ymaps.Placemark(coords, {
        iconCaption: 'Тчк'
    }, {
        preset: 'islands#violetDotIconWithCaption',
        draggable: true
    });
    map.geoObjects.add(pnt);
    // При драгндропе проверять принадлежность полигону
    pnt.events.add('dragend', function () {
        testPolygon(pnt.geometry.getCoordinates());
    });
    return pnt;
}

function setActivePolygon(name,coordsArr){
    if (activePolygon)
        map.geoObjects.remove(activePolygon)
    
    // Создать полигон    
    activePolygon = new ymaps.Polygon(coordsArr, {
        hintContent: name
    }, {
        strokeWidth: 2,
        fillColor: 'rgba(220,220,220,0.3)'
    });

    map.geoObjects.add(activePolygon);


    // Обработчики событий клика на полигоне
    activePolygon.events.add('click',function(e){
        handleCoords(e.get('coords'));
    });
}

// Обработка полученных координат
var handleCoords = function(coords){
    // Создаём точку если надо
    if (!point)
        point = createPlacemark(coords);
    
    // Устанавливаем координаты точки
    point.geometry.setCoordinates(coords);
    // Проверка на принадлежность МКАД
    testPolygon(coords);
}
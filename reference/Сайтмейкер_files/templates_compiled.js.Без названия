let lang = $('body[data-lang]').attr('data-lang');
if (typeof lang == 'undefined') {
    lang = 'ru';
}
var time_back;

console.log('templates_compiled');

if($('.js-calendar-body').length > 0) {

    // console.log('js-calendar-body');

    function setMonthCalendar(year, month, day) {

        if (lang != "en") {

            let monthDays = new Date(year, Number(month), 0).getDate(),
                monthPrefix = new Date(year, Number(month) - 1, 0).getDay(),
                monthDaysText = '';


            const classNameDay = 'sm-calendar-day-week-title ' + $('.js-calendar-body').data('class-name-day');
            const classDay = 'sm-calendar-day ' + $('.js-calendar-body').data('class-day');
            const classWeddingDay = 'number-active sm-number-active ' + $('.js-calendar-body').data('wedding-day-class');

            const dweeks = {
                ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], // Русский
                en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // Английский
                de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]  // Немецкий
            };

            // let dweeks = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];


            if (typeof dweeks_short != 'undefined') {


                if (language == 'ru') {
                    //проверяем переставлен ли dweeks. Он переставляется только один раз при загрузке страницы, поэтому лезем в parent
                    if(!parent.dweeks_short_init) {
                        dweeks_short[7] = dweeks_short[0];
                        dweeks_short.splice(0, 1)
                    }
                }

                dweeks[lang] = dweeks_short;
            }

            for (let i = 0; i < 7; i++) {
                monthDaysText += '<span class="' + classNameDay + ((i > 4) ? ' sm-weekend' : '') + '">' + dweeks[lang][i] + '</span>';
            }

            if (typeof dweeks_short != 'undefined' && language != 'ru') {
                if (monthPrefix < 6) {
                    for (let i = 1; i <= (monthPrefix + 1); i++) {
                        monthDaysText += '<span></span>';
                    }
                }
            } else {
                if (monthPrefix > 0) {
                    for (let i = 1; i <= monthPrefix; i++) {
                        monthDaysText += '<span class="' + classDay + '"></span>';
                    }
                }
            }

            for (let i = 1; i <= monthDays; i++) {
                monthDaysText += '<span ' + ((i == day) ? 'class="' + classDay + ' ' + classWeddingDay + '"' : 'class="' + classDay + '"') + '>' + i + '</span>';
            }

            $('.js-calendar-body').html(monthDaysText);


        }else{

            let monthDays = new Date(year, Number(month), 0).getDate(),
                monthPrefix = new Date(year, Number(month) - 1, 0).getDay(),
                monthDaysText = '';


            const classNameDay = 'sm-calendar-day-week-title ' + $('.js-calendar-body').data('class-name-day');
            const classDay = 'sm-calendar-day ' + $('.js-calendar-body').data('class-day');
            const classWeddingDay = 'number-active sm-number-active ' + $('.js-calendar-body').data('wedding-day-class');

            const dweeks = {
                ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], // Русский
                en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], // Английский
                de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]  // Немецкий
            };

            // let dweeks = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];


            if (typeof dweeks_short != 'undefined')
            {

                // console.log(dweeks_short)
                if (language == 'ru') {
                    dweeks_short[7] = dweeks_short[0];
                    dweeks_short.splice(0, 1)
                }

                dweeks[lang] = dweeks_short;
            }

            for (let i = 0; i < 7; i++) {
                monthDaysText += '<span class="' + classNameDay + ((i > 4) ? ' sm-weekend' : '') + '">' + dweeks[lang][i] + '</span>';
            }

            if (typeof dweeks_short != 'undefined' && language != 'ru') {
                if (monthPrefix < 6) {
                    for (let i = 1; i <= (monthPrefix + 1); i++) {
                        monthDaysText += '<span></span>';
                    }
                }
            } else {
                if (monthPrefix > 0) {
                    for (let i = 1; i <= monthPrefix; i++) {
                        monthDaysText += '<span class="' + classDay + '"></span>';
                    }
                }
            }

            for (let i = 1; i <= monthDays; i++) {
                monthDaysText += '<span ' + ((i == day) ? 'class="' + classDay + ' ' + classWeddingDay + '"' : 'class="' + classDay + '"') + '>' + i + '</span>';
            }

            $('.js-calendar-body').html(monthDaysText);

        }
        parent.dweeks_short_init = true;
    }

}

function StartCountDown(myDiv, myTargetDate) {

    const timerWords = {
        ru: ["Дней", "Часов", "Минут", "Секунд"], // Русский
        en: ["Days", "Hours", "Minutes", "Seconds"], // Английский
        de: ["Tage", "Stunden", "Minuten", "Sekunden"]  // Немецкий
    };

    // $('#days-title').text(timerWords[lang][0])
    // $('#hours-title').text(timerWords[lang][1])
    // $('#minutes-title').text(timerWords[lang][2])
    // $('#seconds-title').text(timerWords[lang][3])

    let dthen = new Date(myTargetDate);
    let dnow = new Date();
    ddiff = new Date(dthen - dnow);
    gsecs = Math.floor(ddiff.valueOf() / 1000);
    CountBack(myDiv, gsecs);
}

function Calcage(secs, num1, num2) {
    s = ((Math.floor(secs / num1)) % num2).toString();
    if (s.length < 2) {
        s = "0" + s;
    }
    return (s);
}

function CountBack(myDiv, secs) {
    let timeArr = [],
        holder;
    if (secs <= 0) {secs = 0}
    timeArr.days = Calcage(secs, 86400, 100000).split('');
    timeArr.hours = Calcage(secs, 3600, 24).split('');
    timeArr.minutes = Calcage(secs, 60, 60).split('');
    timeArr.seconds = Calcage(secs, 1, 60).split('');

    Object.keys(timeArr).map(function (key) {

        holder = $(`#${key}`);
        // Для шаблонов с обычными номерами
        if(holder.children().length == 0){
            holder.text(timeArr[key].join(""))
        }
        // Для шаблонов с раздельными цифрами
        else {
            for (let i = 0; i < holder.children().length; ++i) {
                if($(holder).find('.sm-timer-time_number').length > 0) {
                    $($(holder).find('.sm-timer-time_number > span')[i]).text(timeArr[key][i])
                    if (key == 'days') {
                        $(holder).find('.sm-timer-time_number').hide();
                        for (var t = 0; t < timeArr[key].length; t++) {
                            $($(holder).find('.sm-timer-time_number')[t]).show();
                        }
                    }
                } else {
                    $($(holder).find('div')[i]).text(timeArr[key][i])
                    if (key == 'days') {
                        $(holder).find('div').hide();
                        for (var t = 0; t < timeArr[key].length; t++) {
                            $($(holder).find('div')[t]).show();
                            if(t == 2 && $(".sm-timer-time").length > 0) {
                                $(".sm-timer-time").addClass('bigdays')
                            }
                        }

                    }
                }
            }
        }
    });

    if(secs > 0) {
        clearTimeout(time_back);
        time_back = setTimeout(function () {
            CountBack(myDiv, secs - 1);
        }, 990);
    }
}

function parseLinks(text) {
    console.log('parseLinks')
    // console.log(text);
    // return text;
    if ($.isArray(text)) {
        return text;
    }


    if (/<a\s+[^>]*href=["'].*?["'].*?>.*?<\/a>/i.test(text)) {
        return text.replace(/<a\s+([^>]*?)>/gi, function (match, p1) {
            p1 = p1.replace(/\s*target\s*=\s*['"][^'"]*['"]/i, '');
            return `<a ${p1} target="_blank" rel="noopener noreferrer">`;
        });
    }


    const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g;
    return text.replace(urlRegex, (url) => {
        const href = url.startsWith('http') ? url : `http://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });


}
function initWishSlider(){
    // console.log('slider compiled');
    // console.log(parent.data_value['WISH_TEXT_ITEMS_0'])
    if (typeof wishSlider === 'undefined') {
        wishSlider = '.sm-wishes__content-slider'
    }

    var countSlides = 0;
    if($(wishSlider + '.slick-initialized').length > 0)
    {
        $(wishSlider).slick('unslick');
    }

    for(var w = 0;w < 3; w++)
    {
        $('[data-sm-text="WISH_TEXT_ITEMS_' + w + '"]').parents('.sm-wishes__content-item').remove();

        var alignClass='';
        alignClass = (parent && parent.data_value && parent.data_value['WISH_TEXT_ITEMS_' + w + '_ALIGN'] !== undefined) ? 'sm-text_align-'+parent.data_value['WISH_TEXT_ITEMS_' + w + '_ALIGN'] : '';

        if(parent.data_value['WISH_TEXT_ITEMS_' + w] && typeof(parent.data_value['WISH_TEXT_ITEMS_' + w]) != 'undefined') {
            if(parent.data_value['WISH_TEXT_ITEMS_' + w] != '') {
                $(wishSlider).append('<div class="sm-wishes__content-item"><div class="sm-wishes__content-slide '+ alignClass +'" data-sm-text="WISH_TEXT_ITEMS_' + w + '">' + parseLinks(parent.data_value['WISH_TEXT_ITEMS_' + w]) + '</div></div>');
                countSlides++;
            }
        }
        else
        {
            if(parent.data_value['WISH_TEXT_ITEMS'] && parent.data_value['WISH_TEXT_ITEMS'].length > 0)
            {
                if (parent.data_value['WISH_TEXT_ITEMS_' + w] != '') {
                    $(wishSlider).append('<div class="sm-wishes__content-item"><div class="sm-wishes__content-slide '+ alignClass +'" data-sm-text="WISH_TEXT_ITEMS_' + w + '">' + parseLinks(parent.data_value['WISH_TEXT_ITEMS'][w]) + '</div></div>');
                    countSlides++;
                }
            }
        }
    }

    if($(wishSlider).length > 0) {
        if (typeof wishSliderParams === 'undefined') {
            wishSliderParams = {
                slidesToShow: 1,
                infinite: false,
                adaptiveHeight: true,
                nextArrow: document.querySelector('.sm-wishes-slider_next'),
                prevArrow: document.querySelector('.sm-wishes-slider_prev'),
            };
        }

        $('#count-slides').text(countSlides);
        $('.sm-wishes-slider__center').toggleClass('sm-hidden',countSlides <= 1)
        if(countSlides > 1)
            {
            $(wishSlider).slick(wishSliderParams);

            $($(wishSlider)).on('afterChange', function (event, slick, currentSlide) {
                $("#current-slide").text(currentSlide + 1);
            });
            if ($('.sm-slider-counterTh').length > 0) {
                $(wishSlider).on("init reInit afterChange", function (event, slick)
                {
                    $(".sm-slider-counterTh").html(
                        slick.slickCurrentSlide() + 1 + "/" + slick.slideCount
                    );
                });
            }
        }
    }
}



var own_timer;
function ownSlick(){
    if($('.sm-own_wrapper-img img').length > 1) {
        clearTimeout(own_timer);
        own_timer = setTimeout(function(){
            $('.sm-own_wrapper-img.slick-initialized').slick('unslick')
            if($('.sm-own_wrapper-img img').length > 1) {
                $('.sm-own_wrapper-img').slick({
                    dots: false,
                    infinite: true,
                    slidesToShow: 1,
                    adaptiveHeight: true,
                    slidesToScroll: 1,
                    prevArrow: "<div class='sm-sl-arrow sm-prev'></div>",
                    nextArrow: "<div class='sm-sl-arrow sm-next'></div>",
                })
            }
        },500)
    }
    else
    {
        clearTimeout(own_timer);
        own_timer = setTimeout(function(){
            $('.sm-own_wrapper-img.slick-initialized').slick('unslick')
        },500)
    }
}



function startAllScripts() {

    console.log('startAllScripts');
    $.each($('.slick-initialized'),function(){
        $(this).slick("unslick");
    })

    var year = 2024;
    var month = 9;
    var day = 23;

    var nd = parent.d_mdate;
    if(nd != '')
    {
        nd = parent.d_mdate.split('.');
        if(nd.length >= 3 && nd[2] >= new Date().getFullYear()) {
            year = nd[2];
            month = nd[1];
            day = nd[0];
        }
    }

    StartCountDown("timer", year + '/' + month + '/' + day);
    if($('.js-calendar-body').length > 0) {
        // console.log('set calendar');
        setMonthCalendar(year, month, day)
    }


    Fancybox.bind('[data-fancybox]', {
            touch: true,
            closeBtn: true,
            Thumbs: false,
            caption: false,
            autoScale: true,
            on : {
                "reveal": (fancybox) => {
                    // Current slide
                    var slides = fancybox.carousel.slides;
                    $.each(slides,function(k,v){
                        $(v.el).toggleClass('sm-grayscale',$(v.thumbEl).hasClass('sm-grayscale'))

                    })
                },
            }
        }
    );

    initWishSlider();

    window.document.addEventListener('scrollPos', handleEvent, false);
    function handleEvent(e) {
        cursect = e.detail.cursect - 1;
        // console.log("cursect: ", cursect, ` .sm-edit[data-type="${cursect}"]`);
        // console.log($(`.sm-edit`));
        if($(`.sm-edit[data-type="${cursect}"] .sm-js-animation`).length > 0) {
            $(`.sm-edit[data-type="${cursect}"] .sm-js-animation`).each(function () {
                // console.log($(this));
                $(this).addClass('.sm-js-animated')
                $(this).removeClass('.sm-js-animation')
            })
        }

        if($('body.ct-demonstration').length === 0) {
            checkSect();
        }
    }
}



$(window).on('resize', function() {
    initWishSlider()
    if($('.sm-own_wrapper-img img').length > 1) {
        ownSlick();
    }
});

function thankYou()
{
    $('.sm-thanks').toggleClass('active', true).toggleClass('sm-open', true);
    setTimeout(function(){window.location.reload();},3000)
}


$('.sm-template107 .sm-decor-line').append('<div class="sm-decor_blink"></div><div class="sm-decor_blink"></div><div class="sm-decor_blink"></div><div class="sm-decor_blink"></div><div class="sm-decor_blink"></div><div class="sm-decor_blink"></div><div class="sm-decor_blink"></div>')


'use strict';

const apiKeys = ['a6f158e56097453e9fa056afda7a7aee', '15500a931ea6442ba1b7e887f917dedb'];
const ipgeolocation = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKeys[Math.floor(Math.random() * apiKeys.length)]}`;

const timeouts = [];

const mobileAndTabletCheck = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

$(document).ready(() => {
    const links = [{
        name: 'Discord',
        link: 'https://discord.com/users/913227689375170612',
    },
    {
        name: 'Steam',
        link: 'https://steamcommunity.com/id/whyblurry',
    },
    {
        name: 'NameMC',
        link: 'https://namemc.com/profile/nvfy.3',
    },
    {
        name: 'Vanish',
        link: 'https://discord.gg/vanishtool',
    },
    {
        name: 'Guns.lol',
        link: 'https://guns.lol/ı',
    },
    ];

    for (let i in links) {
        let link = links[i];

        $('#marquee').append(`<a href="${link.link}" target="_BLANK">${link.name}</a>`);

        link = $('#marquee').children('a').last();

        if (i != links.length - 1) $('#marquee').append(' <img class="emoticon" src="assets/media/gif/heart.gif> ');
    }

    if (mobileAndTabletCheck()) {
        $('#background').replaceWith('<div id="background" style="background-image: url(assets/images/mobile-background.jpg);"></div>');

        app.shouldIgnoreVideo = true;
    }

    app.titleChanger(['@huntingme', '.gg/vanishtool', 'glub']);
});

if ($.cookie('videoTime')) {
    app.videoElement.currentTime = $.cookie('videoTime');
    app.audioElement.currentTime = $.cookie('videoTime');
}

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.body.onkeyup = (event) => {
    if (event.keyCode == 32 && app.skippedIntro) {
        if (app.backgroundToggler) {
            app.videoElement.play();
            app.audioElement.play();
        } else {
            app.videoElement.pause();
            app.audioElement.pause();
        }

        return (app.backgroundToggler = !app.backgroundToggler);
    }
};

$('html').on('contextmenu', (event) => {
    const img = document.createElement('img');

    const trollfaceLight = app.skippedIntro ? '' : 'trollface-light';

    img.src = './assets/others/trollface.jpg';
    img.width = 64;
    img.height = 64;
    img.alt = 'nvfy.lol';
    img.style = `position: absolute; left: ${event.pageX}px; top: ${event.pageY}px; z-index: 10`;
    img.className = `troll ${trollfaceLight}`;

    document.body.appendChild(img);
});

setInterval(() => {
    $('.troll').remove();
}, 600);

$('.skip').click(() => {
    skipIntro();
});

$.fn.extend({
    animateCss: function (animationName) {
        const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        this.addClass(`animated ${animationName}`).one(animationEnd, () => {
            $(this).removeClass(`animated ${animationName}`);
        });

        return this;
    },
});

const writeLine = (text, speed, timeout, callback) => {
    timeout = typeof timeout === 'number' ? timeout : [0, (callback = timeout)];

    const lineNumber = app.id !== 2 ? ++app.id : (app.id += 2);

    setTimeout(() => {
        const typed = new Typed(`#line${lineNumber}`, {
            strings: text,
            typeSpeed: speed,
            onComplete: callback,
        });
    }, timeout);
};

$.getJSON(ipgeolocation, (data) => {
    writeLine(['https://nvfy.lol/authenticating...', "Granting access to <span style='font-size: 14px; color: #e87aff;'>[Website]</span>..."], 30, () => {
        if (app.skippedIntro) return;

        clearCursor();

        const usernames = ['user', 'dude'];

        const ip = data.ip ? data.ip : usernames[Math.floor(Math.random() * usernames.length)];
        const country = data.country_name ? data.country_name : 'your country';

        writeLine([`Access granted! <span style='font-size: 14px; color: #0f0;'>[success]</span>`, `Welcome back, <i style='color: #0f0'>${ip}</i>! By the way, nice to see someone from ${country} here!`], 30, 500, () => {
            if (app.skippedIntro) return;

            clearCursor();

            writeLine([`<i style='color: #F62459'>nvfy.lol â˜­â™›â›§</i>`], 120, 500, () => {
                timeouts.push(
                    setTimeout(() => {
                        if (app.skippedIntro) return;

                        clearCursor();

                        setTimeout(() => {
                            skipIntro();
                        }, 500);
                    }, 1000)
                );
            });
        });
    });
});

const skipIntro = () => {
    if (app.skippedIntro) return;

    app.skippedIntro = true;

    timeouts.forEach((timeout) => {
        clearTimeout(timeout);
    });

    $('.top-right').remove();

    $('#main').fadeOut(100, () => {
        $('#main').remove();

        $('#marquee').marquee({
            duration: 15000,
            gap: 420,
            delayBeforeStart: 1000,
            direction: 'left',
            duplicated: true,
        });

        setTimeout(() => {
            $('.brand-header').animateCss(app.effects[Math.floor(Math.random() * app.effects.length)]);
        }, 200);

        setTimeout(() => {
            const typed = new Typed('#brand', {
                strings: app.brandDescription,
                typeSpeed: 40,

                onComplete: () => {
                    clearCursor();
                },
            });
        }, 1350);

        setTimeout(() => {
            if (!app.shouldIgnoreVideo) {
                app.videoElement.play();
                app.audioElement.play();
            }

            app.videoElement.addEventListener(
                'timeupdate',
                () => {
                    $.cookie('videoTime', app.videoElement.currentTime, { expires: 1 });
                },
                false
            );

            $('.marquee-container').css('visibility', 'visible').hide().fadeIn(100);
            $('.marquee-container').animateCss('zoomIn');
            $('.container').fadeIn();
            $('.background').fadeIn(200, () => {
                if (!app.shouldIgnoreVideo) $('#audio').animate({ volume: app.musicVolume }, app.musicFadeIn);
            });

            // Dispatch the custom event to signal that the intro has finished
            document.dispatchEvent(new Event('introFinished'));
        }, 200);
    });
};


const clearCursor = () => {
    return $('span').siblings('.typed-cursor').css('opacity', '0');
};

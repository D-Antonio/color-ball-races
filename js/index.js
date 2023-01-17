//(function () {
    const $DOM = this;

    Item = function (name, details, action) {
        this.name = name;
        this.details = details;
        this.action = action;
    }

    var itemList = [
        new Item(
            "Cárcel",
            "Cadena perpetua por marica! puedes dar una vida a cambio de tu libertad o esperar a que un oponente realice una vuelta ",
            function () {
                if (player[0].v > 1) {
                console.log(player);
                game.cheket(3, player[0].b);
                console.log(player);
                player[0].p = 0;
                console.log(player);
                } else if (confirm("No tienes suficientes vidas :( quieres continuar?"))
                game.cheket(3, player[0].b);
            },
        ),
        new Item(
            "Bomba",
            "Explota a la chusma! y quitale una vida al oponentes",
            function (argument) {
                //
            },
        ),
        new Item(
            "Cuerda",
            "Atrapa a tu oponente y haz que retroseda",
            function () {},
        ),
        new Item(
            "Lanza-Misil",
            "Lanza un misil al jugador mas sercano",
            function () {},
        ),
        new Item(
            "Mina",
            "Pon una mina, >:3 explota a los distraidos que la pisen",
            function () {},
        ),
        new Item(
            "Slime",
            "Todo aquel que pise tu slime quedara pegado por algunos segundos",
            function () {},
        ),
        new Item(
            "Azucar",
            "Siente el azucar en tus venas y la velocidad en tus piernas!",
            function () {
                if (vX > 3) vX += game.getNumRand(2, 5);
                if (vY > 3) vY += game.getNumRand(2, 5);
            },
        ),
        new Item(
            "Perla de End",
            "Usala para teletrasportarte a un logar random del mapa!",
            function () {
                let i = player[0].b + 11;
                if (i > blockList.length - 1) i = i - blockList.length;
                let cont = game.getNumRand(player[0].b + 1, i);
                player[0].b = cont;
                player[0].x = blockList[cont].x * 10 + (blockList[cont].w * 20) / 4;
                pX = w / 2 - player[0].x;
                player[0].y = blockList[cont].y * 10 + (blockList[cont].h * 20) / 4;
                pY = h / 2 - player[0].y;
            },
        ),
        new Item(
            "Llave",
            "Una llave?? jaja ahora eres inmune a la carcel :0",
            function () {},
        ),
    ];

    const ctx = {
        pantalla: $DOM.e_pantalla.getContext("2d"),
        mapa: $DOM.e_mapa.getContext("2d"),
        fondo: $DOM.e_fondo.getContext("2d"),
        juego: $DOM.e_canvas.getContext("2d"),
    }

    const w = $DOM.e_canvas.width;
    const h = $DOM.e_canvas.height;

    var keydown = []

    var fps = {
        frameCount: 0,
        currentFps: 0,
        lasFrame: new Date().getTime(),
        show () {
            $DOM.e_fps.innerHTML = "FPS: " + this.currentFps
        },
        run () {
            let actualFrame = new Date().getTime();
            if (actualFrame - this.lasFrame >= 1000) {
                this.currentFps = this.frameCount;
                this.frameCount = 0;
                this.lasFrame = actualFrame;
                this.show()
            } this.frameCount++;
        }
    }

    const img = function(src){
        result = new Image();
        result.src = src
        return result;
    }

    const imageList = {
        death: img("img/death.png"),
        miniMap: img("img/minimap.png"),
        logo: img("img/logo.png"),
        btnLeft: img("img/btnLeft.png"),
        lock: img("img/lock.png"),
        btnRight: img("img/btnRight.png"),
        ask: img("img/ask.png"),
        btnDown: img("img/btnDown.png"),
        up: img("img/up.png"),
        btnUp: img("img/btnUp.png"),
        run: img("img/run.png"),
    }

    const div = 2 // no sé para qué es esta mondá, pero se usa para dividir :(, creo que es el tamaño de la bola jajaja
    var $id = null;
    var pX = w / 2;
    var pY = h / 2;
    var vX = 0;
    var vY = 0;
    var veloz = 0.05;
    var localPlayers = null;
    var players =[
        {
            bloque: 0, // b
            vida: 3, // v
            name: $DOM.e_name.value, // n
            item: -1, // o
            id: null, // i
            vuelta: 0, // m
            color: $DOM.e_color.value,
            preso: false, // p = 0
            x: 0,
            y: 0,
        }
    ]

    Bloque = function (x, y, w, h, t = null, img = null) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.t = t;
        this.img = img;
        this.c = [];
    }

    const colorBloqueList = [
        "#00000000",
        "#00000000",
        "#09ff00",
        "#ff0000",
        "#ff9800",
        "#ffffff"
    ]

    Bloque.prototype = {
        isTouching: function (x, y) {
            if (
                x < (this.x * 20) / div ||
                x > (this.x * 20) / div + (this.w * 20) / div ||
                y < (this.y * 20) / div ||
                y > (this.y * 20) / div + (this.h * 20) / div
            ) return false;
            return true;
        },


    }

    const blockList = [
        new Bloque(0, 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 1, 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 3, 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 4, 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 5, 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 6, 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 1, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 6, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 5, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 4, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 3, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 3, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 3, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 4, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 5, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 6, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 8, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 3, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 1, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 10, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 1, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 3, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 5, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 7, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 9, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 11, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 13, w / 20, h / 20, 0),
        new Bloque((w / 20) * 12, (h / 20) * 13, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 13, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 11, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 9, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 7, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 5, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 3, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 2, w / 20, h / 20, 0), 
        new Bloque((w / 20) * 13, (h / 20) * 1, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 14, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 16, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 18, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 0, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 1, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 18, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 16, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 3, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 16, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 18, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 5, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 7, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 9, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 18, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 9, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 7, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 16, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 7, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 9, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 11, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 16, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 18, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 13, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 14, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 18, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 16, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 14, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 12, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 10, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 14, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 13, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 11, w / 20, h / 20, 0), 
        new Bloque((w / 20) * 9, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 9, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 7, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 8, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 6, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 5, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 4, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 3, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 7, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 3, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 4, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 5, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 6, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 9, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 6, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 5, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 4, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 3, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 10, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 11, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 13, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 14, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 16, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 3, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 4, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 5, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 6, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 8, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 10, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 12, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 14, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 16, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 18, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 18, w / 20, h / 20, 0),
        new Bloque((w / 20) * 19, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 18, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 17, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 16, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 15, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 14, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 13, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 12, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 11, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 10, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 9, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 8, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 7, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 6, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 5, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 4, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 3, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 2, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 1, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 19, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 18, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 17, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 16, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 15, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 14, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 13, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 12, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 11, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 10, w / 20, h / 20, 0), 
        new Bloque((w / 20) * 0, (h / 20) * 9, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 8, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 7, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 6, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 5, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 4, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 3, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 2, w / 20, h / 20, 0),
        new Bloque((w / 20) * 0, (h / 20) * 1, w / 20, h / 20, 0),
    ]

    BtnController = function (x, y, w, h, img, fun = () => false ) {
        this.h = Math.round(h);
        this.w = Math.round(w);
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.img = img;
        this.run = fun
    }

    BtnController.prototype = {
        isTouching (x, y) {
            return ( x < this.x || x > this.x + this.w || y < this.y || y > this.y + this.w) ? false : true
        },
    }

    const getBtnList = function(){
        return [
            new BtnController(
                $DOM.e_pantalla.width * 0.08 - $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 2 + $DOM.e_pantalla.height / 9 - $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                imageList.btnLeft
            ),
            new BtnController(
                $DOM.e_pantalla.width * 0.08 + $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 2 + $DOM.e_pantalla.height / 9 - $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                imageList.btnRight
            ),
            new BtnController(
                $DOM.e_pantalla.width * 0.67,
                $DOM.e_pantalla.height / 2 + $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                imageList.btnDown
            ),
            new BtnController(
                $DOM.e_pantalla.width * 0.67,
                $DOM.e_pantalla.height / 2 + $DOM.e_pantalla.height / 9 - ($DOM.e_pantalla.height / 9) * 2,
                $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                imageList.btnUp
            ),
            new BtnController(
                $DOM.e_pantalla.width * 0.67 - ($DOM.e_pantalla.height / 9) * 2,
                $DOM.e_pantalla.height / 2 + $DOM.e_pantalla.height / 9 - $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                $DOM.e_pantalla.height / 9,
                imageList.run
            ),
        ]
    }
    var teclas = {
        87: () => {
            up()
        },

        83: () => {
            down
        },

        65: () => {
            left
        },

        68: () => {
            right
        }
    }
    const controller = {
        launchFullScreen: function(element) {
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
        },

        cancelFullScreen: function() {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        },

        keyTestButton: function(){
            
        },

        useKeyboard: function() {
            window.addEventListener( "keydown", function (e) {
                keydown[e.keyCode] = true
                this.keyTestButton()
            }, false );

            window.addEventListener( "keyup", function (e) {
                keydown[e.keyCode] = false
                this.keyTestButton()
            }, false );
        },

        touchTestButtons: function(event){
            event.preventDefault();
            let target_touches = event.targetTouches
            btnList.forEach(button => {
                for (let index = 0; index < target_touches.length; index++) {
                    const touch = target_touches[index];
                    const x = (touch.clientX - $DOM.e_pantalla.getBoundingClientRect().left)
                    const y = (touch.clientY - $DOM.e_pantalla.getBoundingClientRect().top)
                    if (button.isTouching(x, y)) console.log(button.run())
                    //console.log(x , y, button.x, button.y)
                }
            })
            console.log(target_touches)
        },

        useTouch: function(){
            $DOM.e_pantalla.addEventListener("touchend", this.touchTestButtons, { passive: false });
            $DOM.e_pantalla.addEventListener("touchmove", this.touchTestButtons);
            $DOM.e_pantalla.addEventListener("touchstart", this.touchTestButtons);
            window.addEventListener("resize", render.touchController);
            render.touchController()
        },

        index: function(){
            if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent))
                this.useTouch()
            else 
                this.useKeyboard()
        },

        run () {
            this.up();
            this.down();
            this.left();
            this.right();
        }
    }

    var btnList = null;

    const round = function (num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.abs((Math.round(m) / 100) * Math.sign(num));
    }

    const render = {
        touchController: function () {
            $DOM.e_pantalla.width = $DOM.e_pantalla.width
            $DOM.e_pantalla.width = document.documentElement.clientWidth * 1.3;
            $DOM.e_pantalla.height = document.documentElement.clientHeight * 1.3;
            btnList = getBtnList()
            ctx.pantalla.beginPath()
            btnList.forEach(e => ctx.pantalla.drawImage( e.img, e.x, e.y, e.w, e.h));
            ctx.pantalla.closePath()
        },

        playersMapa: function (p) {
            //console.log(p.bloque)
            $DOM.e_mapa.width = $DOM.e_mapa.width 
            ctx.mapa.beginPath();
            ctx.mapa.lineWidth = 1;
            ctx.mapa.strokeStyle = "#ffffff";
            ctx.mapa.arc(
                blockList[p.bloque].x + w / 20 / 2,
                blockList[p.bloque].y + h / 20 / 2,
                round(h / 20 / div - h / 20 / 4 / 2),
                0,
                Math.PI * 2,
                true
            );
            ctx.mapa.fillStyle = p.color;
            ctx.mapa.fill(); //
            ctx.mapa.stroke();
            ctx.mapa.closePath();
        },

        players: function () {
            ctx.juego.lineWidth = h * 0.009;
            ctx.juego.strokeStyle = "#ffffff";
            ctx.juego.font = h * 0.05 + "px Chunk";
            ctx.juego.textAlign = "center";
            players.forEach(player => {
                this.playersMapa(player)

                ctx.juego.fillStyle = "white";
                ctx.juego.beginPath();
                ctx.juego.fillText(
                    player.name,
                    player.x + pX,
                    pY + player.y - h * 0.045
                );
                ctx.juego.arc(
                    player.x + pX,
                    pY + player.y,
                    round(h * 0.025),
                    0,
                    Math.PI * 2,
                    true
                );
                ctx.juego.fillStyle = player.color; //+'a6';
                ctx.juego.fill(); //
                ctx.juego.stroke();
                ctx.juego.closePath();
            });
        },

        bloquesMapa: function () {
            $DOM.e_fondo.width = $DOM.e_fondo.width
            ctx.fondo.beginPath();
            blockList.forEach( e => {
                console.log(e.c.length)
                if(e.c.length > 0){
                    ctx.fondo.fillStyle = colorBloqueList[e.t]
                    ctx.fondo.rect(e.x + 1.5, e.y + 1.5, e.w - 4, e.h - 4);
                    ctx.fondo.fill();
                }
            })
            ctx.fondo.closePath();
        },

        bloques: function () {
            ctx.juego.beginPath()
            ctx.juego.lineWidth = h * 0.02;
            ctx.juego.strokeStyle = "#42dfb0";
            for (let cont = 0; cont < 5; cont++) {
                const result = players[0].bloque - 2 + cont;
                const i = ( result < 0) ? (blockList.length) + result: result
                const b = blockList[i]
                ctx.juego.rect( (b.x * 20) / div + pX, (b.y * 20) / div + pY, (b.w * 20) / div, (b.h * 20) / div);
                b.c.forEach(e =>{
                    ctx.juego.drawImage( e.img, e.x, e.y, e.w, e.h)
                    this.bloquesMapa(e)
                });
            }
            ctx.juego.fillStyle = "#061618";
            ctx.juego.fill();
            ctx.juego.stroke();
            ctx.juego.closePath();
        },

        juego: function () {
            $DOM.e_canvas.width = $DOM.e_canvas.width
            this.bloques()
            this.players()
            
        }
    }

    const updatePlayers = function(objeto){
        localPlayers = []
        let existe = false

        let data = {
            bloque: parseInt(objeto.bloque), 
            vida: parseInt(objeto.vida), 
            name: objeto.name, 
            item: parseInt(objeto.item), 
            id: parseInt(objeto.id), 
            vuelta: parseInt(objeto.vuelta), 
            color: objeto.color,
            preso: parseInt(objeto.preso), 
            x: parseInt(objeto.x),
            y: parseInt(objeto.y),
        }

        players.forEach(player => {
            localPlayers.push(player)
            if(player.id == objeto.sID && player.id != $id){
                player = data
                existe = true
            }
        });

        if (existe == false && objeto.auth != "ok" && parseInt(objeto.sID) != $id) players.push(data)
    }

    const runSoket = function(){
        ws = new WebSocket("ws://achex.ca:4010");

        ws.onopen = function () {
            ws.send('{"setID":"ball","passwd":"123@Cuatro"}');
        };

        ws.onclose = function () {
            //game.soket();
            alert("Sin Conexion :( ");
        };

        ws.onmessage = function (e) {
            let datos = e.data;
            let objeto =  window.JSON.parse(datos);
            if ($id == null) {
                $id = objeto.SID;
                players[0].id = $id
            } else {
                updatePlayers(objeto)
            }
        };
    }

    const ball = {

        main: function(){
            fps.run()
            window.requestAnimationFrame(ball.main);
        },

        run: function(){
            if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent))
                controller.useTouch()
            else 
                controller.useKeyboard()
        }
    }

    $DOM.e_play.onclick = (function () {
        ball.run();
    });

//})();
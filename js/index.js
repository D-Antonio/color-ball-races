//(function () {
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
                if (i > game.bloque.length - 1) i = i - game.bloque.length;
                let cont = game.getNumRand(player[0].b + 1, i);
                player[0].b = cont;
                player[0].x = game.bloque[cont].x * 10 + (game.bloque[cont].w * 20) / 4;
                pX = w / 2 - player[0].x;
                player[0].y = game.bloque[cont].y * 10 + (game.bloque[cont].h * 20) / 4;
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
        pantalla: this.pantalla.getContext("2d"),
        mapa: this.mapa.getContext("2d"),
        fondo: this.fondo.getContext("2d"),
        juego: this.canvas.getContext("2d"),
    }

    const w = this.canvas.width;
    const h = this.canvas.height;

    var keydown = []

    var fps = {
        frameCount: 0,
        currentFps: 0,
        lasFrame: new Date().getTime(),
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

    var localPlayers = []
    var player =[
        {
            bloque: 0, // b
            vida: 3, // v
            name: this.name.value, // n
            item: -1, // o
            id: null, // i
            vuelta: 0, // m
            color: this.color.value,
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

    const div = 2 // no sé para qué es esta mondá, pero se usa para dividir :(, creo que es el tamaño de la bola jajaja

    Bloque.prototype = {
        tocar: function (x, y) {
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
        new Bloque((w / 20) * 1, 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 3, 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 4, 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 5, 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 6, 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 1, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 6, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 5, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 4, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 3, (h / 20) * 2, w / 20, h / 20, 2), //vida
        new Bloque((w / 20) * 2, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 3, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 3, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 4, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 5, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 6, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 4, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 8, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 3, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 1, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 10, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 0, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 11, (h / 20) * 1, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 3, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 5, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 7, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 8, w / 20, h / 20, 4), //o9bjeto
        new Bloque((w / 20) * 11, (h / 20) * 9, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 11, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 13, w / 20, h / 20, 1),
        new Bloque((w / 20) * 12, (h / 20) * 13, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 13, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 11, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 10, w / 20, h / 20, 5), //player[0].p
        new Bloque((w / 20) * 13, (h / 20) * 9, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 7, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 5, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 3, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 2, w / 20, h / 20, 2), //vida
        new Bloque((w / 20) * 13, (h / 20) * 1, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 14, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 16, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 18, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 0, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 1, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 19, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 18, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 16, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 3, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 16, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 18, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 5, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 7, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 9, w / 20, h / 20, 4), //objeto
        new Bloque((w / 20) * 19, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 18, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 9, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 7, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 16, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 6, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 15, (h / 20) * 7, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 9, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 11, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 16, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 18, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 13, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 14, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 18, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 16, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 14, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 12, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 15, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 10, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 14, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 13, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 11, w / 20, h / 20, 2), //vida
        new Bloque((w / 20) * 9, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 9, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 7, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 8, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 6, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 5, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 4, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 3, (h / 20) * 6, w / 20, h / 20, 3), //objeto
        new Bloque((w / 20) * 2, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 7, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 3, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 4, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 5, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 6, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 9, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 6, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 5, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 4, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 3, (h / 20) * 10, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 10, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 2, (h / 20) * 11, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 13, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 14, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 16, w / 20, h / 20, 1),
        new Bloque((w / 20) * 2, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 3, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 4, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 5, (h / 20) * 17, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 6, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 8, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 10, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 12, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 14, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 15, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 16, (h / 20) * 17, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 17, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 18, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 18, w / 20, h / 20, 1),
        new Bloque((w / 20) * 19, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 18, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 17, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 16, (h / 20) * 19, w / 20, h / 20, 2), // vida
        new Bloque((w / 20) * 15, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 14, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 13, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 12, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 11, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 10, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 9, (h / 20) * 19, w / 20, h / 20, 4), //objeto
        new Bloque((w / 20) * 8, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 7, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 6, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 5, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 4, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 3, (h / 20) * 19, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 2, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 1, (h / 20) * 19, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 19, w / 20, h / 20, 5), //player[0].p
        new Bloque((w / 20) * 0, (h / 20) * 18, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 17, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 16, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 15, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 14, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 13, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 12, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 11, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 10, w / 20, h / 20, 2), //vida
        new Bloque((w / 20) * 0, (h / 20) * 9, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 8, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 7, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 6, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 5, w / 20, h / 20, 3), //trampa
        new Bloque((w / 20) * 0, (h / 20) * 4, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 3, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 2, w / 20, h / 20, 1),
        new Bloque((w / 20) * 0, (h / 20) * 1, w / 20, h / 20, 1),
    ]

    Btn = function (x, y, w, h, img = null) {
        this.h = Math.round(h);
        this.w = Math.round(w);
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.img = img;
    }

    Btn.prototype = {
        containsPoint: function (x, y) {
          return ( x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.width) ? false : true;
        },
    }

    const btnList = [
        new Btn(
            this.pantalla.width * 0.08 - this.pantalla.height / 9,
            this.pantalla.height / 2 + this.pantalla.height / 9 - this.pantalla.height / 9,
            this.pantalla.height / 9,
            this.pantalla.height / 9,
            imageList.btnLeft
        ),
        new Btn(
            this.pantalla.width * 0.08 + this.pantalla.height / 9,
            this.pantalla.height / 2 + this.pantalla.height / 9 - this.pantalla.height / 9,
            this.pantalla.height / 9,
            this.pantalla.height / 9,
            imageList.btnRight
        ),
        new Btn(
            this.pantalla.width * 0.67,
            this.pantalla.height / 2 + this.pantalla.height / 9,
            this.pantalla.height / 9,
            this.pantalla.height / 9,
            imageList.btnDown
        ),
        new Btn(
            this.pantalla.width * 0.67,
            this.pantalla.height / 2 + this.pantalla.height / 9 - (this.pantalla.height / 9) * 2,
            this.pantalla.height / 9,
            this.pantalla.height / 9,
            imageList.btnUp
        ),
        new Btn(
            this.pantalla.width * 0.67 - (this.pantalla.height / 9) * 2,
            this.pantalla.height / 2 + this.pantalla.height / 9 - this.pantalla.height / 9,
            this.pantalla.height / 9,
            this.pantalla.height / 9,
            imageList.run
        ),
    ]

    const parseJSON = function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}
	
		if ( data === null ) {
			return data;
		}
	
		if ( typeof data === "string" ) {
	
			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );
	
			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {
	
					return ( new Function( "return " + data ) )();
				}
			}
		}
	
		console.log( "Invalid JSON: " + data );
	}

    const controles = {
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

        keyboard: function() {
            window.addEventListener(
                "keydown",
                function (e) {
                    keydown[e.keyCode] = true;
                },
                false
            );
            window.addEventListener(
                "keyup",
                function (e) {
                    keydown[e.keyCode] = false;
                },
                false
            );
        },

        touch
    }

    const ball = {

    }

//})();
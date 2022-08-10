(function() {
var objeto = [
{
	nom: "Cárcel",
	des: "Cadena perpetua por marica! puedes dar una vida a cambio de tu libertad o esperar a que un oponente realice una vuelta ",
	fun: function(){
		if (player[0].v > 1) {
			console.log(player);

			game.cheket(3, player[0].b);
			console.log(player);

			player[0].p = 0;
			console.log(player);
		} else if (confirm("No tienes suficientes vidas :( quieres continuar?")) game.cheket(3, player[0].b);
	}
},
{
	nom: 'Bomba',
	des: "Explota a la chusma! y quitale una vida al oponentes",
	fun: function(argument) {
		// body...
	}
},
{
	nom: "Cuerda",
	des: "Atrapa a tu oponente y haz que retroseda",
	fun: function(){

	}
},
{
	nom: "Lanza-Misil",
	des: "Lanza un misil al jugador mas sercano",
	fun: function(){

	}
},
{
	nom: "Mina",
	des: "Pon una mina, >:3 explota a los distraidos que la pisen",
	fun: function(){

	}
},
{
	nom: "Slime",
	des: "Todo aquel que pise tu slime quedara pegado por algunos segundos",
	fun: function(){

	}
},
{
	nom: "Azucar",
	des: "Siente el azucar en tus venas y la velocidad en tus piernas!",
	fun: function(){
		if(vX > 3) vX += game.getNumRand(2,5);
		if(vY > 3) vY += game.getNumRand(2,5);
	}
},
{
	nom: "Perla de End",
	des: "Usala para teletrasportarte a un logar random del mapa!",
	fun: function(){
		let i = player[0].b + 11;
		if (i>(game.bloque.length-1)) i = i - (game.bloque.length);
		let cont = game.getNumRand(player[0].b +1, i);
		player[0].b = cont;
		player[0].x =(game.bloque[cont].x*10) + ((game.bloque[cont].w * 20)/4);
		pX =(w/2)-player[0].x;
		player[0].y =(game.bloque[cont].y*10) + ((game.bloque[cont].h * 20)/4);
		pY =(h/2)-player[0].y;
	}
},
{
	nom: "Llave",
	des: "Una llave?? jaja ahora eres inmune a la carcel :0",
	fun: function(){

	}
}

];

	var pantalla = document.getElementById('pantalla'), pctx = pantalla.getContext('2d');
	var mapa = document.getElementById('mapa'), mctx = mapa.getContext('2d');
	var fondo = document.getElementById('fondo'), fctx = fondo.getContext('2d');
	var index0;
	var canvas = document.getElementById('canvas'), keydown = [], ctx = canvas.getContext('2d');
	var ws;
	var veloz = 5;
	var id = null;
	const w = canvas.width;
	const h = canvas.height;
	var div = 2;
	var player = [];
	var pX = w/2;
	var pY = h/2;
	var vX = 0;
	var vY = 0;
	var izquierda_ = false;
	var derecha_ = false;
	var abajo_ = false;
	var r = []; 
	var arriba_ = false;
	var frameCount = 0, currentFps = 0, lasFrame = new Date().getTime(); //glovales para calcular los FPS
	var mm = new Image();
		mm.src = "m.png";
	var up = new Image();
		up.src = "v.png";
	var oo = new Image();
		oo.src = "o.png";
	var cc = new Image();
		cc.src = "c.png";
	var limo = new Image();
		limo.src = "limo.png";

	Bloque = function(x, y, w, h, t) {
		this.x = x; this.y = y; this.w = w; this.h = h; this.t = t;
		this.c = []
	};

	Btn = function(x, y, width, height) {
    this.height = height; this.width = width; this.x = x; this.y = y;
  };

	Bloque.prototype = {
		tocar:function(x, y) {
	      if (x < ((this.x*20)/div) || x > ((this.x*20)/div) + ((this.w * 20)/div) || y < ((this.y*20)/div) || y > ((this.y*20)/div) + ((this.h * 20)/div)) {
	        return false;
	      }
	      return true;
	  	}
	};

	Btn.prototype = {
		containsPoint:function(x, y) {
      		if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.width) {
        		return false;
      		}
      		return true;
    	},
    	tocar:function(x, y) {
	      if (x < ((this.x*20)/div) || x > ((this.x*20)/div) + ((this.width * 20)/div) || y < ((this.y*20)/div) || y > ((this.y*20)/div) + ((this.height * 20)/div)) {
	        return false;
	      }
	      return true;
	  	}
	};


	game = {
		main: function(){
			
			// ********* Enviar datos del juego *********
			 ws.send('{"to":"ddddddd", "b": "'+player[0].b+'", "p": "'+player[0].p+'", "v": "'+player[0].v+'", "n": "'+player[0].n+'", "o": "'+player[0].o+'", "m": "'+player[0].m+'", "x":"'+player[0].x+'", "y": "'+player[0].y+'", "c": "'+player[0].c+'"}');
			// ****** FIN Enviar datos del juego  ****

			let actualFrame = new Date().getTime();
		      if (actualFrame- lasFrame >= 1000) {
		        currentFps = frameCount;
		        frameCount = 0;
		        lasFrame = actualFrame;
		      } frameCount++;
			// ****** Podio *******
			
			/* Organizar de mayor a menor segun el 
			** bloque en el que vaya el jugador
			** 
			** entre mas alto sea el numero del bloque 
			** quiere decir que mas avanzado va en el juego
			*/ 

			r.sort(function(a, b){
				if (a.m > b.m) {
					return -1;
				}
				if (a.m < b.m) {
					return 1;
				}
				return 0;
			});

			r.sort(function(a, b){
				if (a.b > b.b) {
					return -1;
				}
				if (a.b < b.b) {
					return 1;
				}
				return 0;
			});

			// Mostrar en pantalla los resultados del podio
			document.getElementById('r').innerHTML=''; // Limpia el elemento 
			// Escribe en el elementos los resultados

			for (var i = 0; i < r.length; i++) {
				let lok = '';
				if (r[i].p==1) lok = ' - <i class="fas fa-lock fa-fw"></i>';
				document.getElementById('r').innerHTML+=' <i class="border border-white rounded-circle fas fa-circle fa-fw" style="color: '+r[i].c+' "></i> <b>'+r[i].n+' </b> | <i class="fas fa-heartbeat fa-fw"></i>'+r[i].v+' <i class="fas fa-flag-checkered fa-fw"></i> '+r[i].m + lok +'<br>';
			}
			// ***** FIN Podio ***

			
			// ******* Movimiento en el mapa ***

			// Lo siguiente, si no esta tacando el camino va a ir lento;
			
				canvas.width = canvas.width; mapa.width = mapa.width; // Borrar todo
			
				let lento = true;
				for (let cont = 0; cont < 4; cont++) {
					let i = (player[0].b - 1) + cont;
					if (i>(game.bloque.length-1)) i = i - (game.bloque.length);
					if (player[0].b == 205 && game.bloque[0].tocar(player[0].x, player[0].y)) {
						player[0].b = 0;
						player[0].m = player[0].m + 1;
					}

					if ((game.bloque[i] != undefined && i >= player[0].b )&& game.bloque[i].tocar(player[0].x, player[0].y)) {
						player[0].b = i;
						lento = false;
					} 

					if (i < 0) i = (game.bloque.length)+i;
					ctx.beginPath();
						ctx.lineWidth=(h*0.02);
						ctx.strokeStyle='#42dfb0';
						ctx.rect((game.bloque[i].x*20)/div + pX, (game.bloque[i].y*20)/div + pY, (game.bloque[i].w*20)/div, (game.bloque[i].h*20)/div);
						ctx.fillStyle = "#061618";
						ctx.fill();
						ctx.stroke();
						ctx.closePath();
						
						for (let x = 0; x < game.bloque[i].c.length; x++) {
							let m = game.bloque[i].c[x];
							let img;
							ctx.beginPath();
							if (game.bloque[i].t == 2) img = up;
							if (game.bloque[i].t == 3) img = mm;
							if (game.bloque[i].t == 4) img = oo;
							if (game.bloque[i].t == 5) img = cc;
							ctx.drawImage( img ,(m.x*20)/div + pX, (m.y*20)/div + pY, (m.width *20)/div, (m.height *20)/div);
							ctx.fill();
							ctx.closePath();
							if (game.bloque[i].c[x].tocar(player[0].x, player[0].y)) {
								game.bloque[i].c = [];
								game.cheket(game.bloque[i].t, i);

								//break
							} 
							
						}
						
				}
			if (player[0].p == 0) {

				if (lento==true) {
					vX *= 0.95;
					vY *= 0.95;
				} 

				// Los controles del personaje
				if(keydown[87]==true || arriba_) vY += -0.02; // w
				if(keydown[65]==true || izquierda_)  vX += -0.02 // A
				if(keydown[83]==true || abajo_) vY += 0.02; // S
				if(keydown[68]==true || derecha_) vX += 0.02; // D

				// actualizar 
				player[0].y += vY;
				pY -= vY;
				player[0].x += vX;
				pX -= vX;
			}
			// ***** FIN movimiento en el mapa ***

			


			for (let x = 0; x < player.length; x++) {
				ctx.beginPath();
				ctx.lineWidth=(h*0.009);
				ctx.strokeStyle='#ffffff';
				ctx.font = (h*0.05)+'px Chunk';
				ctx.fillStyle = 'white';
				ctx.textAlign = 'center';
				ctx.fillText(player[x].n, player[x].x+pX, (pY+player[x].y-(h*0.045)) );
				ctx.arc(player[x].x+pX, pY+player[x].y, game.round(h*0.025), 0, (Math.PI)*2, true);
		      	ctx.fillStyle = player[x].c;//+'a6';
				ctx.fill();//
				ctx.stroke();
				ctx.closePath();

				mctx.beginPath();
				mctx.lineWidth=1;
				mctx.strokeStyle='#ffffff';
				mctx.arc((game.bloque[player[x].b].x+((w/20)/2)),(game.bloque[player[x].b].y+((h/20)/2)), game.round((((h/20)/div)-(((h/20)/4)/2))), 0, (Math.PI)*2, true);
				mctx.fillStyle = player[x].c;
				mctx.fill();//
				mctx.stroke();
				mctx.closePath();
				//if (x>0) player.splice(x, 1);
			} 
				/*ctx.beginPath();
				ctx.font = (h*0.01)+' Arial';
				ctx.textAlign = 'left';
				ctx.fillStyle = 'white';
				ctx.fillText('vX: '+game.bloque[player[0].b].x, 1, h*0.8);
				ctx.fillText('vX: '+game.bloque[player[0].b].y, 1, h*0.85);
				ctx.fillText('vY: '+player[0].x, 1, h*0.9);
				ctx.fillText('FPS: '+player[0].y, 1, h*0.95);
				ctx.closePath();*/
			
			window.requestAnimationFrame(game.main);
		},

		carsel: false,

		actObjet: function(){
			
			if (player[0].o != -1) {
				objeto[player[0].o].fun();
				player[0].o = -1;
			} document.getElementById('p').innerHTML = '';
			
		},

		cheket: function(t, i){
			switch(t){
				case 2:
					player[0].v = player[0].v+1;
					if(vX > 3) vX += 2;
					if(vY > 3) vY += 2;
				break;

				case 3:
					player[0].v = player[0].v-1;
					vX = 0;
					vY = 0;
					if (player[0].v<=0) {
						player[0].b = 0;
						player[0].v = 3;
						player[0].x = 0;
						player[0].y = 0;
						player[0].p = 0;
						pX = w/2;
						pY = h/2;
						game.msg("F para "+player[0].n);
					}
				break;

				case 5:
					vX = 0;
					vY = 0;
					game.msg(player[0].n+' està en la carsel',2);
					document.getElementById('p').innerHTML=objeto[0].nom+' | '+objeto[0].des;
					player[0].o = 0;
					player[0].p = 1;
					//getObjeto(0);
				break;

				case 4:
					game.msg(player[0].n+' obtuvo objeto',2);
					let cont = game.getNumRand(1, objeto.length-1);
					document.getElementById('p').innerHTML=objeto[cont].nom+' | '+objeto[cont].des;
					if (player[0].o==-1) player[0].o = cont;
				break;
			} game.bloque[i].t = 1; game.newMap(false);
		},

		getNumRand: function(min, max) {       
		    return Math.round(Math.random()*(max-min)+parseInt(min));
		},

		msg: function(ico, l){
			//if(l==1) toastr.error('<b style="color: #e0ff00; font-size: 5vh;"><i class="fas '+ico+'"></i></b>', '<i class="border border-white rounded-circle fas fa-circle fa-fw" style="color: #6664ff"></i> <b>Periky</b>', {"positionClass": "toast-top-left"});
			toastr.error('<b style="color: #fff">'+ico+'</b>', '<i style="color: #ff4400">System</i>', {"positionClass": "toast-bottom-center"});
		},

		newMap: function(t = true){
			if (player[0].p == 0) {
				fondo.width = fondo.width;
				if(t){
					game.msg('Nuevo Mapa! >:3',2);
				}
				
				//let cont = 
				for (var i = 2; i < game.bloque.length-2; i++) {
					let b = game.bloque[i];
					if(t){b.t = 1;
					b.t = game.getNumRand(2, 10);
					b.c = [];
					if (b.t == 3) b.t = game.getNumRand(3, 5);
					if (b.t == 4) b.t = game.getNumRand(3, 5);
					if (b.t == 5) b.t = game.getNumRand(2, 10);}
					if (b.t > 1 && b.t<6) {
						fctx.beginPath();
						let cont;
						if (b.t == 2) {
							fctx.fillStyle = '#09ff00';
							cont = 1;
						}
						if (b.t == 3) {
							fctx.fillStyle = '#ff0000';
							cont = game.getNumRand(1, 4);
						}
						if (b.t == 4) {
							fctx.fillStyle = '#ff9800';
							cont = 1;
						}
						if (b.t == 5) {
							fctx.fillStyle = '#ffffff';
							cont = game.getNumRand(1, 3);
						}
						if (t) {for (let r = 0; r < cont; r++) {
							b.c.push(new Btn(
								game.getNumRand(b.x, ((b.x + b.w) - (b.w/4))),
								game.getNumRand(b.y, ((b.y + b.h) - (b.h/4))),
								(b.w/4),
								(b.h/4)
							));
						}}
						
						fctx.rect((b.x+1.5), (b.y+1.5), (b.w-4), (b.h-4));
						fctx.fill();//
						fctx.closePath();

					}
				}
			}
			if (t) {
				let time = game.getNumRand(30, 120);
				for (let i = 1; i < player.length; i++) player.splice(i, 1);
				setTimeout(game.newMap, (time * 1000));
			}
			
		},

		round: function(num){
			var m = Number((Math.abs(num) * 100).toPrecision(15));
    		return Math.abs(Math.round(m) / 100 * Math.sign(num));
		},

		dibujar: function(objeto) {
			//if (objeto.b != null) {
				r = []; // tendra la copia de los jugadores
			//for (var i = 0; i < player.length; i++)  // agregar los judares
			
						let l = false; // existe
						for (var i = 0; i < player.length; i++) {
							r.push(player[i]);
							let e = player[i];
							if (e.i == parseInt(objeto.sID) && e.i != id) {
								e.b = parseInt(objeto.b); 
								e.v = parseInt(objeto.v);
								//e.n = objeto.n; 
								e.o = parseInt(objeto.o);
								if (parseInt(objeto.m) > e.m && player[0].o == 0){
									player[0].p = 0;
									player[0].o = -1;
									document.getElementById('p').innerHTML = '';
								}
								e.m = parseInt(objeto.m); 
								e.x = parseInt(objeto.x);
								e.y = parseInt(objeto.y); 
								e.p = parseInt(objeto.p); 
								//e.c = objeto.c;
								l = true;
							}
							//player.splice(i, 1);
						}
						
						if (l==false && (objeto.auth != 'ok') && parseInt(objeto.sID) != id) {
							 player.push({
								b: parseInt(objeto.b), 
								v: parseInt(objeto.v),
								n: objeto.n,
								o: parseInt(objeto.o),
								m: parseInt(objeto.m), 
								i: parseInt(objeto.sID),
								x: parseInt(objeto.x),
								y: parseInt(objeto.y), 
								p: parseInt(objeto.p), 
								c: objeto.c
							});
						}
				//}
				//console.log(true);
				//}, 20);
		},

		soket: function() {
			ws = new WebSocket("ws://achex.ca:4010");
			ws.onopen = function() {
				ws.send('{"setID":"ddddddd","passwd":"123@Cuatro"}');
			}
			ws.onclose = function(){
				//game.soket();
				alert("Sin Conexion :( ");
			}
			ws.onmessage= function(e){
				let datos = e.data;
				let objeto = jQuery.parseJSON(datos);
				//console.log(objeto);
				if (id==null) {
					id = objeto.SID;
					player.push({
						b:0,
						v:3,
						n: document.getElementById('name').value, //objeto.SID,//prompt("Nombre:"),
						o: -1,
						m:0,
						i: id,
						x: 0,
						y: 0,
						p: 0,
						c: document.getElementById('color').value
					});
					game.main();
					game.newMap();
				} else {
					game.dibujar(objeto);
				}
			}
		},

		botones:[],

testButtons: function(target_touches){
      for (index0 = game.botones.length - 1; index0 > -1; -- index0) {
        button = game.botones[index0];
        button.active = false;
        for (index1 = target_touches.length - 1; index1 > -1; -- index1) {
          touch = target_touches[index1];
          if (button.containsPoint((touch.clientX - pantalla.getBoundingClientRect().left) * 1, (touch.clientY - pantalla.getBoundingClientRect().top) * 1)) {
            if (index0==0){
             izquierda_ = true;
             derecha_ = false;
             //abajo_ = false;
             //arriba_ = false;
           }  if (index0 ==1) {
            izquierda_ = false;
             derecha_ = true;
             //abajo_ = false;
             //arriba_ = false;
          }  if (index0 == 2) {
            //izquierda_ = false;
             //derecha_ = false;
             abajo_ = true;
             arriba_ = false;
          }  if (index0==3) {
            //izquierda_ = false;
             //derecha_ = false;
             abajo_ = false;
             arriba_ = true;
          } if (index0==4) game.actObjet()
            //break;
          }
        } 
      }
    },


    touchEnd:function() {
      arriba_ = false;
      izquierda_ = false;
      abajo_ = false;
      derecha_ = false;
    },

    touchMove:function(event) {
      event.preventDefault();
      game.testButtons(event.targetTouches);

    },

    touchStart:function(event) {
      event.preventDefault();
      //console.log(event.targetTouches);
      game.testButtons(event.targetTouches);
    },

    pistaControles:function() {
    	pantalla = document.getElementById('pantalla'), pctx = pantalla.getContext('2d');
    	pantalla.width = document.documentElement.clientWidth * 1.3;
    	pantalla.height = document.documentElement.clientHeight * 1.3;

    	game.botones = [];
    	game.botones.push( new Btn((((pantalla.width * 0.08))-(pantalla.height/9)),(pantalla.height/2)+(pantalla.height/9)-(pantalla.height/9), (pantalla.height/9), (pantalla.height/9)));
    	game.botones.push( new Btn(((pantalla.width * 0.08))+(pantalla.height/9),(pantalla.height/2)+(pantalla.height/9)-(pantalla.height/9), (pantalla.height/9), (pantalla.height/9)));
    	game.botones.push( new Btn(pantalla.width * 0.67,(pantalla.height/2)+(pantalla.height/9), (pantalla.height/9), (pantalla.height/9)));
    	game.botones.push( new Btn (pantalla.width * 0.67, (pantalla.height/2)+(pantalla.height/9)-((pantalla.height/9)*2),(pantalla.height/9),(pantalla.height/9)));
    	game.botones.push( new Btn((pantalla.width * 0.67)-((pantalla.height/9)*2),(pantalla.height/2)+(pantalla.height/9)-(pantalla.height/9), (pantalla.height/9), (pantalla.height/9)));
 		pctx.beginPath();
 		button = game.botones[0];
        pctx.drawImage(ba, (button.x), (button.y), button.width, button.height);
 		button = game.botones[1];
        pctx.drawImage(bd, (button.x), (button.y), button.width, button.height);
 		button = game.botones[2];
        pctx.drawImage(bs, (button.x), (button.y), button.width, button.height);
 		button = game.botones[3];
        pctx.drawImage(bw, (button.x), (button.y), button.width, button.height);
 		pctx.closePath();

 		pctx.beginPath();
        pctx.lineWidth=h*0.005;
		pctx.strokeStyle='#ffffff';
		pctx.fillStyle = "#00000000"
		button = game.botones[4];
        pctx.rect((button.x), (button.y), button.width, button.height);
        pctx.drawImage(bx, (button.x), (button.y), button.width, button.height);
		pctx.fill();
		pctx.stroke();
 		pctx.closePath();
      
      

    },

		bloque: [
			new Bloque(           0,			0,  (w/20),  (h/20),  0),
			new Bloque( ((w/20)* 1),			0,  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),			0,  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 3),			0,  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 4),			0,  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 5),			0,  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 6),			0,  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),			0,  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)* 1),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 6),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 5),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 4),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 3),  ((h/20)* 2),  (w/20),  (h/20),  2),//vida
			new Bloque( ((w/20)* 2),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)* 3),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 3),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 4),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 5),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 6),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)* 4),  (w/20),  (h/20),  3),//trampa
			new Bloque( ((w/20)* 8),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 3),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 1),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*10),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)* 0),  (w/20),  (h/20),  3),//trampa
			new Bloque( ((w/20)*11),  ((h/20)* 1),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)* 3),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)* 5),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)* 7),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)* 8),  (w/20),  (h/20),  4),//o9bjeto
			new Bloque( ((w/20)*11),  ((h/20)* 9),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)*11),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)*13),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*12),  ((h/20)*13),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)*13),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)*11),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)*10),  (w/20),  (h/20),  5),//player[0].p
			new Bloque( ((w/20)*13),  ((h/20)* 9),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)* 7),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)* 5),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)* 3),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)* 2),  (w/20),  (h/20),  2),//vida
			new Bloque( ((w/20)*13),  ((h/20)* 1),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*14),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*16),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*18),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)* 0),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)* 1),  (w/20),  (h/20),  3),//trampa
			new Bloque( ((w/20)*19),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*18),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*16),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)* 3),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*16),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*18),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)* 5),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)* 7),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)* 9),  (w/20),  (h/20),  4),//objeto
			new Bloque( ((w/20)*19),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*18),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)* 9),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)* 7),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*16),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)* 6),  (w/20),  (h/20),  3),//trampa
			new Bloque( ((w/20)*15),  ((h/20)* 7),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)* 9),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)*11),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*16),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*18),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)*13),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)*14),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*18),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*16),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*14),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*12),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)*15),  (w/20),  (h/20),  3),//trampa
			new Bloque( ((w/20)*10),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)*14),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)*13),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)*11),  (w/20),  (h/20),  2),//vida
			new Bloque( ((w/20)* 9),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 9),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 7),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 8),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 6),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 5),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 4),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 3),  ((h/20)* 6),  (w/20),  (h/20),  3),//objeto
			new Bloque( ((w/20)* 2),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)* 7),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 3),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 4),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 5),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 6),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)* 9),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 6),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 5),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 4),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 3),  ((h/20)*10),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)*10),  (w/20),  (h/20),  3), //trampa
			new Bloque( ((w/20)* 2),  ((h/20)*11),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)*13),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)*14),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)*16),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 2),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 3),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 4),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 5),  ((h/20)*17),  (w/20),  (h/20),  3), //trampa
			new Bloque( ((w/20)* 6),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 8),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*10),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*12),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*14),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*15),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*16),  ((h/20)*17),  (w/20),  (h/20),  3),//trampa
			new Bloque( ((w/20)*17),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*18),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)*18),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*19),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*18),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*17),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*16),  ((h/20)*19),  (w/20),  (h/20),  2), // vida
			new Bloque( ((w/20)*15),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*14),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*13),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*12),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*11),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)*10),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 9),  ((h/20)*19),  (w/20),  (h/20),  4),//objeto
			new Bloque( ((w/20)* 8),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 7),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 6),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 5),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 4),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 3),  ((h/20)*19),  (w/20),  (h/20),  3),//trampa
			new Bloque( ((w/20)* 2),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 1),  ((h/20)*19),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*19),  (w/20),  (h/20),  5),//player[0].p
			new Bloque( ((w/20)* 0),  ((h/20)*18),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*17),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*16),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*15),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*14),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*13),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*12),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*11),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)*10),  (w/20),  (h/20),  2),//vida
			new Bloque( ((w/20)* 0),  ((h/20)* 9),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)* 8),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)* 7),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)* 6),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)* 5),  (w/20),  (h/20),  3),//trampa
			new Bloque( ((w/20)* 0),  ((h/20)* 4),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)* 3),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)* 2),  (w/20),  (h/20),  1),
			new Bloque( ((w/20)* 0),  ((h/20)* 1),  (w/20),  (h/20),  1)
		],

		start: function() {
			// body...
			this.soket();
			
			document.getElementById('lobby').style.display = "none";
			document.getElementById('game').style.display = "";
			window.addEventListener('keydown',function(e) {
				keydown[e.keyCode] = true;
				if (e.keyCode == 32) game.actObjet();
				// alert(e.keyCode) 32
			},false);
			window.addEventListener('keyup',function(e) {
		    	keydown[e.keyCode] = false;
		    },false);
		    window.addEventListener("load", function(){

				player[0].c = document.getElementById('color').value; // Color del jugador
				document.getElementById('color').style["background-color"] = player[0].c;
			}, false);

		}
	}
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		var ba = new Image(); ba.src = "a.png";
		var bs = new Image(); bs.src = "s.png";
		var bd = new Image(); bd.src = "d.png";
		var bw = new Image(); bw.src = "w.png";
		var bx = new Image(); bx.src = "x.png";
		pantalla.addEventListener("touchend", game.touchEnd, {passive:false});
		pantalla.addEventListener("touchmove", game.touchMove, {passive:false});
		pantalla.addEventListener("touchstart", game.touchStart, {passive:false});
		window.addEventListener('resize', game.pistaControles);
		bx.onload = function(){game.pistaControles();}
		bw.onload = function(){game.pistaControles();}
	}
	let $btn = $("#play");
 	$btn.click(function() {
		game.start();
	});
		//game.start();

})()

// ************************************* PANTALLA COMPLETA *****************************************


function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

// Lanza en pantalla completa en navegadores que lo soporten
function cancelFullScreen() {
     if(document.cancelFullScreen) {
         document.cancelFullScreen();
     } else if(document.mozCancelFullScreen) {
         document.mozCancelFullScreen();
     } else if(document.webkitCancelFullScreen) {
         document.webkitCancelFullScreen();
     }
 }


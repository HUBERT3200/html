        //STAŁE

        var CANVAS_WIDTH = 800;
        var NANONAUT_WIDTH = 120;

        var nanonautX = CANVAS_WIDTH - NANONAUT_WIDTH;
        var CANVAS_WIDTH = 800;
        var CANVAS_HEIGHT = 600;
        var NANONAUT_WIDTH = 181;
        var NANONAUT_HEIGHT = 229;
        var GROUND_Y = 540;
        var NANONAUT_Y_ACCELERATION = 1;
        var SPACE_KEYCODE = 32;
        var NANONAUT_JUMP_SPEED = 20;
        var NANONAUT_X_SPEED = 5;
        var BACKGROUND_WIDTH = 1000;
        var NANONAUT_NR_FRAMES_PER_ROW = 5;
        var NANONAUT_NR_ANIMATION_FRAMERS = 7;
        var NANONAUT_ANIMATION_SPEED = 3;

        //KONFIGURACJA WSTĘPNA

        var canvas = document.createElement('canvas');
        var c = canvas.getContext('2d');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        document.body.appendChild(canvas);

        var nanonautImage = new Image();
        nanonautImage.src = 'animatedNanonaut.png';

        var backgroundImage = new Image();
	    backgroundImage.src = 'background.png';

        var brush1Image = new Image();
	    brush1Image.src = 'bush1.png';

	    var brush2Image = new Image();
        brush2Image.src = 'bush2.png';

        var nanonautX = CANVAS_WIDTH / 2;
        var nanonautY = GROUND_Y - NANONAUT_HEIGHT;
        var nanonautYSpeed = 0;
        var nanonautIsInTheAir = false;
        var spaceKeyIsPressed = false;
        var nanonautFramerNr = 0;
        var gameFrameCounter = 0;

        var bushData = [{
        x: 550,
        y: 100,
        image: brush1Image
        }, {
        x: 750,
        y: 90,
        image: brush2Image
        }];

        window.addEventListener('keydown', onKeyDown);

        window.addEventListener('keyup', onKeyUp);

        window.addEventListener('load', start);

        function start() {
            window.requestAnimationFrame(mainLoop);
        }

        //PĘTLA GŁÓWNA

        function mainLoop() {
            update();
            draw();
            window.requestAnimationFrame(mainLoop);
        }

        //STEROWANIE

        function onKeyDown(event) {
            if (event.keyCode === SPACE_KEYCODE) {
                spaceKeyIsPressed = true;
            }
        }
        function onKeyUp(event) {
            if (event.keyCode === SPACE_KEYCODE) {
                spaceKeyIsPressed = false;
            }
        }

        //AKTUALIZACJA

        function update() {
            gameFrameCounter = gameFrameCounter + 1;
            nanonautX = nanonautX + NANONAUT_X_SPEED;
            if (spaceKeyIsPressed && !nanonautIsInTheAir) {
                nanonautYSpeed = -NANONAUT_JUMP_SPEED;
                nanonautIsInTheAir = true;
            }
            //ZAKTUALIZUJ NANOUTĘ
            nanonautY = nanonautY + nanonautYSpeed;
            nanonautYSpeed = nanonautYSpeed + NANONAUT_Y_ACCELERATION;
            if (nanonautY > (GROUND_Y - NANONAUT_HEIGHT)) {
                nanonautY = GROUND_Y - NANONAUT_HEIGHT;
                nanonautYSpeed = 0;
                nanonautIsInTheAir = false;
            }

            //ZAKTUALIZUJ ANIMACJE
            if ((gameFrameCounter % NANONAUT_ANIMATION_SPEED) === 0) {
			nanonautFramerNr = nanonautFramerNr + 1;
			if (nanonautFramerNr >= NANONAUT_NR_ANIMATION_FRAMERS) {
				nanonautFramerNr = 0;
			}
		}
            //AKTUALIZACJA KAMERY
            cameraX = nanonautX - 150;

            //AKTUALIZACJA KRAKA
            for (var i=0; i<bushData.length; i++) {
                if ((bushData[i].x - cameraX) < -CANVAS_WIDTH) {
                bushData[i].x += (2 * CANVAS_WIDTH) +150;
                }
            }
        }

        //PYSOWANIE

        function draw() {
            c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            //NARYSUJ NIEBO
            c.fillStyle = 'LightSkyBlue'
            c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);

            //NARYSUJ TŁO
            var backgroundX = - (cameraX % BACKGROUND_WIDTH);
            c.drawImage(backgroundImage, backgroundX, -210);
            c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, -210);

            //NARYSUJ ZIEMIE
            c.fillStyle = 'ForestGreen'
            c.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);

            //NARYSUJ KRZAK1
            for (var i=0; i<bushData.length; i++) {
            			c.drawImage(bushData[i].image, bushData[i].x, GROUND_Y - bushData[i].y );
            		}
            //NARYSUJ NANOUTĘ
            var nanonautSpriteSheetRow = Math.floor(nanonautFramerNr / NANONAUT_NR_FRAMES_PER_ROW);
            var nanonautSpriteSheetColumn = nanonautFramerNr % NANONAUT_NR_FRAMES_PER_ROW;
            var nanonautSpriteSheetX = nanonautSpriteSheetColumn * NANONAUT_WIDTH;
            var nanonautSpriteSheetY = nanonautSpriteSheetRow * NANONAUT_HEIGHT;
            c.drawImage(nanonautImage, nanonautSpriteSheetX, nanonautSpriteSheetY,
            NANONAUT_WIDTH, NANONAUT_HEIGHT, nanonautX - cameraX, nanonautY, NANONAUT_WIDTH, NANONAUT_HEIGHT);
        }
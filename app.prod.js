const AppProd = {
    data: () => ({
        difficulty: 1,
        sequence: [],
        gameStarted: false,
        segmentsStates: [
            { isActive: false, isClicked: false },
            { isActive: false, isClicked: false },
            { isActive: false, isClicked: false },
            { isActive: false, isClicked: false }
        ],
        isPlayingSeq: false,
        userAnswer: [],
        aboutGameInfo: "Выберете уровень сложности и нажмите 'Начать игру'",
        indexForCompare: 0,
        round: 1,
        audios: [
            {
                mp3: new Audio("audios/1.mp3"),
                ogg: new Audio("audios/1.ogg")
            },
            {
                mp3: new Audio("audios/2.mp3"),
                ogg: new Audio("audios/2.ogg")
            },
            {
                mp3: new Audio("audios/3.mp3"),
                ogg: new Audio("audios/3.ogg")
            },
            {
                mp3: new Audio("audios/4.mp3"),
                ogg: new Audio("audios/4.ogg")
            }
        ],
        muted: false,
        forRealHard: {
            segments: [{}, {}, {}, {}]
        }
    }),

    methods: {
        startGame() {
            this.gameStarted = true;
            this.playSeq();
        },

        playSeq() {
            this.isPlayingSeq = true;
            this.addNewValueInSq();
            let playAt = 0;
            console.log("послед ", this.sequence);
            if (this.difficulty == 4) {
                if (playAt < this.sequence.length) {
                    setTimeout(() => {
                        this.upDifficulty(this.getRandomNumber(1, 10), this);
                        setTimeout(this.activateSegments, 1000, "on", playAt);
                    }, 200);
                }
            }

            setTimeout(this.activateSegments, 1000, "on", playAt);
        },

        activateSegments(value, playAt) {
            let timer;
            if (this.difficulty == 1) {
                this.setAudioDuration(0.8);
                timer = 1500;
            }
            if (this.difficulty == 2) {
                timer = 1000;
            }
            if (this.difficulty == 3) {
                timer = 400;
                this.setAudioDuration(0.9);
            }
            if (this.difficulty == 4) {
                timer = 400;
                this.setAudioDuration(0.9);
            }

            if (playAt < this.sequence.length) {
                if (value == "on") {
                    console.log("включить элемент", playAt);
                    this.segmentsStates[this.sequence[playAt]].isActive = true;
                    if (!this.muted) this.soundPlayer(this.sequence[playAt], "play");
                    setTimeout(this.activateSegments, timer, "off", playAt);
                }

                if (value == "off") {
                    console.log("выключить элемент", playAt);
                    this.segmentsStates[this.sequence[playAt]].isActive = false;
                    playAt++;
                    setTimeout(this.activateSegments, 500, "on", playAt);
                }
            }

            if (playAt == this.sequence.length) {
                this.isPlayingSeq = false;
                playAt = 0;
            }
        },

        userInput(value) {
            if (!this.isPlayingSeq && this.gameStarted) {
                if (!this.muted) this.soundPlayer(value, "play");
                if (value != this.sequence[this.indexForCompare]) {
                    console.log("you lose");
                    this.aboutGameInfo = `Вы проиграли! Ваш счет: ${this.sequence
                        .length - 1} `;
                    this.indexForCompare = 0;
                    this.gameStarted = false;
                    this.round = 0;
                    this.sequence = [];
                    this.forRealHard = {
                        segments: [{}, {}, {}, {}],
                    }
                }
                if (this.gameStarted) {
                    this.indexForCompare++;
                }

                this.userAnswer.push(value);
                if (this.indexForCompare == this.sequence.length && this.gameStarted) {
                    this.playSeq();
                    this.round++;
                    this.indexForCompare = 0;
                }
            }
        },

        animateClick(index) {
            this.segmentsStates[index].isClicked = !this.segmentsStates[index].isClicked;
        },

        classGenerator(i) {
            return {
                clicked: this.segmentsStates[i].isClicked,
                active: this.segmentsStates[i].isActive
            };
        },

        styleGenerator(value) {
            if (this.forRealHard.segments[value] !== undefined) {
                return {
                    contain: value,
                    style: this.forRealHard.segments[value]
                };
            }

            return -1;
        },

        addNewValueInSq() {
            this.sequence.push(this.getRandomNumber(0, 3));
        },

        getRandomNumber(min, max) {
            return Math.floor(min + Math.random() * (max + 1 - min));
        },

        soundPlayer(i, state) {
            if(state == 'play') {
                if (this.audios[i].mp3.canPlayType("audio/mp3") != "") {
                    this.audios[i].mp3.play();
                } else {
                    if (this.audios[i].mp3.canPlayType("audio/ogg") != "") {
                        this.audios[i].ogg.play();
                    } else {
                        console.log(
                            "Извините, ваш браузер не поддерживает воспроизведение аудио."
                        );
                    }
            }
            if(state == 'stop') {
                this.audios[i].mp3.pause();
                this.audios[i].mp3.currentTime = 0.0;
                this.audios[i].ogg.pause();
                this.audios[i].ogg.currentTime = 0.0;
                }
            }

        },

        setAudioDuration(rate) {
            for(let j = 0; j < this.audios.length; j++){
                this.audios[j].mp3.playbackRate = rate
                this.audios[j].ogg.playbackRate = rate
            }
        },

        upDifficulty(number, that) {
            switch (number) {
                case 1:
                case 4:
                function randomRotate() {
                    let randomAngle = that.getRandomNumber(1, 360);
                    let iterations = 0;
                    let animationIntervalId = setInterval(() => {
                        iterations += 5;
                        that.forRealHard.transform = `rotate(${iterations}deg)`;

                        if (iterations >= randomAngle) {
                            clearInterval(animationIntervalId);
                        }
                    }, 10);
                }
                    randomRotate();
                    break;
                case 2:
                function addGreyFilter() {
                    let idx = that.getRandomNumber(0, 3);
                    that.forRealHard.segments[idx].filter = "grayscale(1)";
                }
                    addGreyFilter();
                    break;

                case 3:
                function setOpacity() {
                    let idx = that.getRandomNumber(0, 3);
                    that.forRealHard.segments[idx].opacity = "0.1";
                }
                    setOpacity();
                    break;

                default:
                    break;
            }
        }
    }
};

Vue.createApp(AppProd).mount("#simonTheGameApp");

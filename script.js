document.addEventListener("DOMContentLoaded", () => {
      lucide.createIcons();

      /* 1. LOADER CLOSURE */
      const loader = document.getElementById('loader');
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }, 1200);

      /* 2. CANVAS SAKURA & STARFALL ANIMATION */
      const canvas = document.getElementById("bg-canvas");
      const ctx = canvas.getContext("2d");

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      window.addEventListener("resize", () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
      });

      const petals = [];
      const stars = [];
      const glowParticles = [];

      const petalCount = 30;
      const starCount = 40;
      const glowCount = 20;

      class Petal {
        constructor() {
          this.reset();
          this.y = Math.random() * height;
        }
        reset() {
          this.x = Math.random() * width;
          this.y = -20;
          this.size = Math.random() * 10 + 6;
          this.speedY = Math.random() * 1.3 + 0.7;
          this.speedX = Math.random() * 0.8 - 0.4;
          this.rotation = Math.random() * 360;
          this.rotationSpeed = Math.random() * 1.5 - 0.75;
          this.opacity = Math.random() * 0.4 + 0.4;
        }
        update() {
          this.y += this.speedY;
          this.x += this.speedX + Math.sin(this.y / 25) * 0.25;
          this.rotation += this.rotationSpeed;
          if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
            this.reset();
          }
        }
        draw() {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate((this.rotation * Math.PI) / 180);
          ctx.fillStyle = `rgba(255, 95, 162, ${this.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(255, 95, 162, 0.3)";
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.5);
          ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      class Star {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.size = Math.random() * 1.2 + 0.4;
          this.alpha = Math.random();
          this.speed = Math.random() * 0.015 + 0.005;
        }
        update() {
          this.alpha += this.speed;
          if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
        }
        draw() {
          ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      class GlowParticle {
        constructor() {
          this.reset();
          this.y = Math.random() * height;
        }
        reset() {
          this.x = Math.random() * width;
          this.y = height + 10;
          this.size = Math.random() * 3 + 2;
          this.speedY = -(Math.random() * 0.5 + 0.2);
          this.speedX = Math.random() * 0.4 - 0.2;
          this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
          this.y += this.speedY;
          this.x += this.speedX;
          if (this.y < -10) this.reset();
        }
        draw() {
          ctx.save();
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(255, 95, 162, 0.5)";
          ctx.fillStyle = `rgba(255, 193, 218, ${this.alpha})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      for (let i = 0; i < petalCount; i++) petals.push(new Petal());
      for (let i = 0; i < starCount; i++) stars.push(new Star());
      for (let i = 0; i < glowCount; i++) glowParticles.push(new GlowParticle());

      function animate() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(s => { s.update(); s.draw(); });
        glowParticles.forEach(gp => { gp.update(); gp.draw(); });
        petals.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
      }
      animate();

      /* 3. MUSIC PLAYER MP3 */
      const music = document.getElementById("bg-music");
      const playBtn = document.getElementById("play-btn");
      const playIcon = document.getElementById("play-icon");
      const muteBtn = document.getElementById("mute-btn");
      const muteIcon = document.getElementById("mute-icon");
      const containerPlayer = document.getElementById("player-container");
      music.volume = 0.5;
      music.loop = true;

      playBtn.addEventListener("click", async () => {
          try{
              if(music.paused){
                  await music.play();
                  containerPlayer.classList.add("music-active");
                  playIcon.setAttribute("data-lucide","pause-circle");
              }else{
                  music.pause();
                  containerPlayer.classList.remove("music-active");
                  playIcon.setAttribute("data-lucide","play-circle");
              }
              lucide.createIcons();
          }catch(err){
              console.log(err);
          }
      });

      muteBtn.addEventListener("click",()=>{
          music.muted=!music.muted;
          if(music.muted){
              muteIcon.setAttribute("data-lucide","volume-x");
          }else{
              muteIcon.setAttribute("data-lucide","volume-2");
          }
          lucide.createIcons();
      });

      /* 4. BUTTON RIPPLES & SFX TRAPPERS */
      document.querySelectorAll(".btn, .vibe-btn, #back-to-top").forEach((button) => {
        button.addEventListener("click", function (e) {
          playClickSFX();
          const x = e.clientX - e.target.getBoundingClientRect().left;
          const y = e.clientY - e.target.getBoundingClientRect().top;
          
          const ripple = document.createElement("span");
          ripple.classList.add("ripple");
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          
          this.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      });

      /* 5. NAME CUSTOMIZER & TEXT GENERATOR */
      const recipientInput = document.getElementById("recipient-input");
      const surpriseBtn = document.getElementById("surprise-btn");
      const dynamicName = document.getElementById("dynamic-name");

      let currentRecipient = "Sahabat Terbaikku";

      const vibesMessages = {
        sweet: [
          "Selamat ulang tahun ya! Di hari istimewa ini, aku bersyukur banget kamu ada di dunia ini. Makasih sudah selalu bawa kehangatan dan kebaikan buat orang-orang di sekitarmu. Semoga seluruh impian manismu terwujud, tetap jadi diri sendiri yang luar biasa, sehat selalu, dan dikelilingi cinta yang melimpah setiap hari!",
          "Happy Birthday! Semoga langkahmu ke depan selalu dituntun oleh kemudahan dan kebahagiaan sejati. Aku bangga banget punya kamu dalam hidupku."
        ],
        gokil: [
          "Eaaa... ada yang nambah tua nih! Selamat ulang tahun ya! Jangan sedih keriput nambah satu, yang penting jatah traktiran buat kita jangan sampai kelewat, hehe. Semoga makin hits, makin lancar rezekinya biar bisa sering-sering traktir, dijauhkan dari drakor sedih, dan selalu gokil kayak biasa. Tetap awet muda ya!",
          "Selamat ulang tahun! Ciee yang usianya makin berkurang tapi tingkahnya masih aja kocak. Semoga sehat selalu biar bisa terus bikin rusuh bareng-bareng!"
        ],
        deep: [
          "Seiring bertambahnya angka usiamu hari ini, aku merenungi betapa berartinya kehadiranmu di sini. Hidup mungkin tidak selalu mudah, tapi jiwamu yang tangguh selalu sanggup melewati segalanya. Selamat ulang tahun. Terima kasih atas ketulusanmu yang tenang, semoga kedamaian sejati selalu memeluk harimu.",
          "Hari ini adalah pengingat berharga betapa istimewanya kamu. Semoga setiap impian tersembunyi di relung hatimu segera menemukan jalan indahnya untuk mekar."
        ]
      };

      let activeVibe = "sweet";

      surpriseBtn.addEventListener("click", () => {
        const val = recipientInput.value.trim();
        currentRecipient = val !== "" ? val : "Sahabat Terbaikku";
        dynamicName.textContent = `Untuk: ${currentRecipient}`;
        
        document.getElementById("message").scrollIntoView({ behavior: "smooth" });
        if (music.paused) {
        music.play().then(() => {
        containerPlayer.classList.add("music-active");
        playIcon.setAttribute("data-lucide","pause-circle");
        lucide.createIcons();
    });

}
      });

      // Vibe Selector Interactions
      const vibeButtons = document.querySelectorAll(".vibe-btn");
      vibeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          vibeButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          activeVibe = btn.getAttribute("data-vibe");
          startTypingAnimation();
        });
      });

      /* 6. TYPING ANIMATION ENGINE */
      const typedTextElement = document.getElementById("typed-text");
      const readAgainBtn = document.getElementById("read-again-btn");
      let typingIdx = 0;
      let isTyping = false;
      let typingTimeout = null;

      function startTypingAnimation() {
        if (isTyping) {
          clearTimeout(typingTimeout);
          isTyping = false;
        }
        isTyping = true;
        typedTextElement.textContent = "";
        typingIdx = 0;
        
        // Ambil pesan acak berdasarkan vibe terpilih
        const msgList = vibesMessages[activeVibe];
        const selectedMessage = msgList[Math.floor(Math.random() * msgList.length)];
        
        typeNextChar(selectedMessage);
      }

      function typeNextChar(text) {
        if (typingIdx < text.length) {
          typedTextElement.textContent += text.charAt(typingIdx);
          typingIdx++;
          typingTimeout = setTimeout(() => typeNextChar(text), 30);
        } else {
          isTyping = false;
        }
      }

      readAgainBtn.addEventListener("click", startTypingAnimation);

      /* 7. VIRTUAL GIFT BOX SHAKE & CLICKER REVEAL */
      const giftCards = document.querySelectorAll(".gift-card");
      giftCards.forEach(card => {
      card.addEventListener("click", () => {
          if (card.classList.contains("opened")) return;

          card.classList.add("opened");
          triggerConfetti(20);
          showToast("Kado berhasil dibuka! 🎉");
      });
  });

      /* 8. INTERACTIVE BIRTHDAY CAKE & REAL MICROPHONE BLOW DETECTION */
      const flame = document.getElementById("cake-flame");
      const blowBtn = document.getElementById("blow-btn");
      const celebrateAgainBtn = document.getElementById("celebrate-again-btn");
      const wishText = document.getElementById("wish-celebration-text");
      const micStatusContainer = document.getElementById("mic-status-container");

      let isBlown = false;

      function extinguishCandle() {
        if (isBlown) return;
        isBlown = true;
        flame.classList.add("extinguished");
        wishText.textContent = "Make a Wish! ✨ Doa terbaikmu sedang meluncur ke langit...";
        wishText.classList.add("show");
        triggerConfetti(50);
        showToast("Hore! Lilinnya mati ditiup! 🎂✨");

        blowBtn.style.display = "none";
        celebrateAgainBtn.style.display = "inline-flex";
      }

      function resetCandle() {
        isBlown = false;
        playClickSFX();
        flame.classList.remove("extinguished");
        wishText.classList.remove("show");
        celebrateAgainBtn.style.display = "none";
        blowBtn.style.display = "inline-flex";
      }

      blowBtn.addEventListener("click", extinguishCandle);
      celebrateAgainBtn.addEventListener("click", resetCandle);

      // AUDIO DETECTION (Web Audio API)
      async function setupMicrophone() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 1024;

          microphone.connect(analyser);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);

          micStatusContainer.style.display = "flex";

          javascriptNode.onaudioprocess = () => {
            if (isBlown) return;
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;

            const length = array.length;
            for (let i = 0; i < length; i++) {
              values += array[i];
            }

            const average = values / length;
            // Batas volume suara tiupan angin ke mikrofon
            if (average > 60) {
              extinguishCandle();
            }
          };
        } catch (e) {
          console.log("Mikrofon diblokir atau tidak disupport. Menggunakan tombol manual.");
        }
      }

      // Deteksi tiupan otomatis setelah interaksi pertama pengguna
      document.body.addEventListener("click", () => {
      setupMicrophone();
      }, { once:true });

      /* 9. WISHES GENERATOR */
      const birthdayWishes = [
        "Semoga tahun ini membawakanmu cinta hangat, kesehatan tanpa batas, dan senyuman termanis.",
        "Setiap hari bersamamu adalah kado luar biasa. Selamat hari lahir buat temen paling asik!",
        "Semoga impian-impian gilamu pelan-pelan berubah jadi kisah sukses yang keren banget!",
        "Kamu layak dapet segenap kebahagiaan di dunia ini karena kebaikan hatimu yang tulus.",
        "Semoga jiwamu selalu penuh energi positif, dan tubuhmu diberkati kesehatan yang prima.",
        "Terima kasih telah membawakan tawa riang untuk setiap sudut hari-hari kami. Selamat ulang tahun!"
      ];

      const generateBtn = document.getElementById("generate-btn");
      const copyBtn = document.getElementById("copy-btn");
      const generatedText = document.getElementById("generated-wish-text");
      const customWishInput = document.getElementById("custom-wish-input");
      const saveWishBtn = document.getElementById("save-wish-btn");

      generateBtn.addEventListener("click", () => {
        const randIndex = Math.floor(Math.random() * birthdayWishes.length);
        generatedText.textContent = birthdayWishes[randIndex];
        generatedText.style.animation = "none";
        setTimeout(() => {
          generatedText.style.animation = "heartBeat 1s ease";
        }, 10);
      });

      copyBtn.addEventListener("click", () => {
        const textToCopy = generatedText.textContent;
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
        showToast("Teks doa berhasil disalin! 📝");
      });

      saveWishBtn.addEventListener("click", () => {
        const customVal = customWishInput.value.trim();
        if (customVal !== "") {
          generatedText.textContent = customVal;
          customWishInput.value = "";
          showToast("Doa kustommu berhasil dipasang! 💖");
        } else {
          showToast("Ketik doamu terlebih dahulu pada kotak ya!");
        }
      });

      /* 10. CLOSING & THANKS SHOWER */
      const thanksBtn = document.getElementById("thanks-btn");
      thanksBtn.addEventListener("click", () => {
        triggerConfetti(60);
        for (let i = 0; i < 15; i++) {
          setTimeout(createFloatingHeart, i * 100);
        }
        showToast("Sama-sama! Semoga harimu menyenangkan! ❤️");
      });

      function createFloatingHeart() {
        const heart = document.createElement("span");
        heart.innerHTML = "❤️";
        heart.classList.add("floating-heart");
        heart.style.left = `${Math.random() * 80 + 10}vw`;
        heart.style.bottom = "10vh";
        heart.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
        heart.style.animationDuration = `${Math.random() * 1 + 1}s`;
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
      }

      /* 11. CONFETTI GENERATOR (ELEGANT FALLS) */
      function triggerConfetti(count) {
        for (let i = 0; i < count; i++) {
          const conf = document.createElement("div");
          conf.style.position = "fixed";
          conf.style.width = `${Math.random() * 10 + 6}px`;
          conf.style.height = `${Math.random() * 6 + 4}px`;
          
          const colors = ["#FF5FA2", "#FFC1DA", "#FFFFFF", "#FF9EBE"];
          conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          conf.style.left = `${Math.random() * 100}vw`;
          conf.style.top = `-10px`;
          conf.style.zIndex = "99999";
          conf.style.borderRadius = "2px";
          conf.style.pointerEvents = "none";
          
          const speedX = Math.random() * 4 - 2;
          const speedY = Math.random() * 3 + 4;
          const rotation = Math.random() * 360;
          
          document.body.appendChild(conf);

          let currentY = -10;
          let currentX = parseFloat(conf.style.left);
          let currentRotation = rotation;

          const fallInterval = setInterval(() => {
            currentY += speedY;
            currentX += speedX + Math.sin(currentY / 20) * 0.5;
            currentRotation += 5;
            
            conf.style.top = `${currentY}px`;
            conf.style.transform = `rotate(${currentRotation}deg)`;
            
            if (currentY > window.innerHeight) {
              clearInterval(fallInterval);
              conf.remove();
            }
          }, 16);
        }
      }

      /* TOAST & BACK TO TOP UTILS */
      const toast = document.getElementById("toast");
      const toastMessage = document.getElementById("toast-message");
      let toastTimeout;

      function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      }

      const backToTop = document.getElementById("back-to-top");
      const progressBar = document.getElementById("scroll-progress");

      window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = (window.pageYOffset / totalHeight) * 100;
          progressBar.style.width = `${progress}%`;
        }

        if (window.pageYOffset > 500) {
          backToTop.classList.add("visible");
        } else {
          backToTop.classList.remove("visible");
        }
      });

      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
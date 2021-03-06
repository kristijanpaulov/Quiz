function kviz() {

    let pitanjaIOdgovori = [];
    let brojac = 0;
    let brojPoena = 0;
    let tabelaHighScore = JSON.parse(localStorage.getItem('tabelaHighScore')) || [];
    let proveriDaLiJeOdgovoreno = []

    // Baza sa pitanjima i odgovorima
    fetch('data.json')
        .then(response => response.json())
        .then(json =>
            pitanjaIOdgovori = json
        );
    // Nasumicno postavljanje pitanja
    function mapiranje(x) {
        $('.poeni')[0].classList.remove("poeniPozitivno", "poeniNegative");
        for (i = 1; i < 5; i++) {
            $('.q' + i)[0].classList.remove("bg-success", "bg-danger", "border-dark", "noClick", "btn-dark")
        };
        let promesanibrojevi = [1, 2, 3, 4];
        let probro = promesanibrojevi
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        $('.pitanje')[0].innerText = x[brojac].pitanje;
        $('.q' + probro[0])[0].innerText = x[brojac].tacanOdg;
        $('.q' + probro[1])[0].innerText = x[brojac].pogresanOdg1;
        $('.q' + probro[2])[0].innerText = x[brojac].pogresanOdg2;
        $('.q' + probro[3])[0].innerText = x[brojac].pogresanOdg3;
        brojac++;
    };
    // Pocetak testa
    $('#start')[0].addEventListener('click', zapocniTest);

    function zapocniTest() {

        bookmarkLoad();

        proveraOdgovorenihPitanja()
        let promesajNiz = pitanjaIOdgovori
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        pitanjaIOdgovori = promesajNiz;

        $('.q').removeClass('d-none').show();
        $('.next').removeClass('d-none').show();
        $('#start')[0].style.display = 'none';
        $('.poljeSaPoenima')[0].classList.add('d-none');
        $('.pisanjeNadimka')[0].classList.add('d-none');
        $('.poeni')[0].classList.remove('d-none');
        $('.bookmarkPolje')[0].classList.remove('d-none');
        $('.ime')[0].value = '';
        $('.str')[brojac].classList.add('btn-primary');
        $('.str')[brojac].classList.remove('btn-outline-primary');
        mapiranje(promesajNiz);

    };
    // Sledece pitanje
    $('.next')[0].addEventListener('click', nextFunkcija)
    function nextFunkcija() {

        let poslednjePitanje = false
        if (pitanjaIOdgovori[brojac] == undefined) {
            krajKviza();
        }
        else {
            while ($('.str')[brojac].classList.contains('btn-success') || $('.str')[brojac].classList.contains('btn-danger')) {
                brojac++
                if (brojac == pitanjaIOdgovori.length) {
                    poslednjePitanje = true
                    brojac -= 1
                    break
                }
            }
            mapiranje(pitanjaIOdgovori)
            $('.str').each(function () {
                this.classList.remove('btn-primary')
                if (this.classList.contains('btn-success') || this.classList.contains('btn-danger')) {
                }
                else {
                    this.classList.add('btn-outline-primary')
                }
            });
            $('.str')[brojac - 1].classList.add('btn-primary');
            $('.str')[brojac - 1].classList.remove('btn-outline-primary');
            sledeceIliKraj();
            if (poslednjePitanje) {
                $('.q').each(function () {
                    this.classList.add('noClick');
                    this.classList.add("btn-dark");
                })
            };
        };
    };
    // provera da li je kraj kviza
    function sledeceIliKraj() {
        if (pitanjaIOdgovori[brojac] == undefined) {
            $('.next')[0].innerHTML = 'End quiz';
        } else {
            $('.next')[0].innerHTML = 'Next';
        }
    };
    // Provera tacnosti odgovora
    $('.q').click(function () {

        let element = this;
        let textNode = element.firstChild;
        let URI = textNode.data;
        $('.q').each(function () {
            this.classList.add('noClick');
        });
        if (URI == pitanjaIOdgovori[brojac - 1].tacanOdg) {
            element.classList.add("bg-success");
            element.classList.add("border-dark");
            $('.poeni')[0].classList.add('poeniPozitivno');
            $('.str')[brojac - 1].classList.add('btn-success')
            brojPoena++;
        }
        else {
            element.classList.add("bg-danger");
            element.classList.add("border-dark");
            $('.poeni')[0].classList.add('poeniNegative');
            $('.str')[brojac - 1].classList.add('btn-danger')
            brojPoena--;
        }

        $('.poeni')[0].innerHTML = 'Points: ' + brojPoena;

        proveriDaLiJeOdgovoreno[brojac - 1] = 1

    });
    // Kraj Kviza
    function krajKviza() {
        $('.next')[0].classList.add('d-none');
        $('.poeni')[0].classList.add('d-none');
        $('.poljeSaPoenima')[0].classList.remove('d-none');
        $('.bookmarkPolje')[0].classList.add('d-none');
        $('.str').each(function () {
            this.classList.remove('btn-primary');
            this.classList.add('btn-outline-primary');
        })
        $('.q').each(function () {
            this.classList.add('d-none');
        })
        if (brojPoena > 0) {
            $('.pitanje')[0].innerHTML = 'Your score is ' + brojPoena + ' , Congratulations! </br> You can repeat the test!';
            $('.pisanjeNadimka')[0].classList.remove('d-none');
        }
        else {
            $('.pitanje')[0].innerHTML = 'Unfortunately, your score is ' + brojPoena + ' , more luck next time! </br> You can repeat the test!';
        };
        $('.ponovite')[0].classList.remove('d-none');
    };
    // unosenje podataka u localstorage
    $('.unosenjeSkora').click(function () {
        let imeIgraca = $('.ime')[0].value;
        if (imeIgraca == '') { }
        else {
            if (brojPoena > 0) {
                let igrac = {
                    ime: imeIgraca,
                    skor: brojPoena
                };
                tabelaHighScore.push(igrac);
                localStorage.setItem('tabelaHighScore', JSON.stringify(tabelaHighScore));
                const parent = document.getElementById("tabelaSaPoenima");
                while (parent.firstChild) {
                    parent.firstChild.remove();
                };
                loadHighScore();
            }
        }

        $('.pisanjeNadimka')[0].classList.add('d-none');
    });
    // ponavljanje testa
    $('.ponovite').click(function () {
        brojac = 0;
        brojPoena = 0;
        $('.next')[0].innerHTML = 'Next';
        $('.poeni')[0].innerHTML = 'Points: 0';
        $('.ponovite')[0].classList.add('d-none');
        zapocniTest();
    });
    // vadjenje podataka iz localstoraga
    function loadHighScore() {
        tabelaHighScore.sort((a, b) => b.skor - a.skor);
        for (i = 0; i < tabelaHighScore.length; i++) {
            if (i < 10) {
                let tr = document.createElement('tr');
                let th1 = document.createElement('th');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let imeTR = document.createTextNode(tabelaHighScore[i].ime);
                let poeniTR = document.createTextNode(tabelaHighScore[i].skor);
                tr.append(th1);
                tr.append(td2);
                tr.append(td3);
                th1.append(i + 1);
                td2.append(imeTR);
                td3.append(poeniTR);
                $('.tabelaSaPoenima')[0].append(tr);
            };
        };
    };
    loadHighScore();
    // Bookmark
    function bookmarkLoad() {
        $('.bookmarkPolje')[0].innerHTML = ''
        for (i = 0; i < pitanjaIOdgovori.length; i++) {
            let a = document.createElement('a');
            a.classList.add('btn-outline-primary', 'btn', 'm-1', 'p-2', 'str');
            a.setAttribute('href', "#");
            let tekstBookmark = document.createTextNode('a');
            a.append(i + 1);
            $('.bookmarkPolje')[0].append(a);
        };
    };
    // klik na bookmark
    $(document).on('click', '.str', function () {
        let element = this;
        let brojBookmark = element.innerHTML;
        mapiranjeBookmark(pitanjaIOdgovori[brojBookmark - 1]);
        brojac = Number(brojBookmark);

        $('.str').each(function () {
            this.classList.remove('btn-primary')
            if (this.classList.contains('btn-success') || this.classList.contains('btn-danger')) {
            }
            else {
                this.classList.add('btn-outline-primary')
            }
        });

        element.classList.remove('btn-outline-primary');
        element.classList.add('btn-primary');
        $('.poeni')[0].classList.remove("poeniPozitivno", "poeniNegative")
        for (i = 1; i < 5; i++) {
            $('.q' + i)[0].classList.remove("bg-success", "bg-danger", "border-dark", "noClick", "btn-dark")
        };
        sledeceIliKraj();
        if (proveriDaLiJeOdgovoreno[brojac - 1] == 1) {
            $('.q').each(function () {
                this.classList.add('noClick');
                this.classList.add("btn-dark");
            });
        }
    })
    // mapiranje bookmarka
    function mapiranjeBookmark(x) {
        let promesanibrojevi = [1, 2, 3, 4];
        let probro = promesanibrojevi
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        $('.pitanje')[0].innerText = x.pitanje;
        $('.q' + probro[0])[0].innerText = x.tacanOdg;
        $('.q' + probro[1])[0].innerText = x.pogresanOdg1;
        $('.q' + probro[2])[0].innerText = x.pogresanOdg2;
        $('.q' + probro[3])[0].innerText = x.pogresanOdg3;
    };
    // proveriDaLiJeOdgovoreno

    function proveraOdgovorenihPitanja() {
        for (let i = 0; i < pitanjaIOdgovori.length; ++i) proveriDaLiJeOdgovoreno[i] = 0;
    }

}
kviz()
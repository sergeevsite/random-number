'use strict';

document.addEventListener('DOMContentLoaded', () => {


  let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  let isDisabled = function(...n) {
    n.forEach(elem => {
      if(elem.getAttribute('disabled')) {
        elem.removeAttribute('disabled');
      } else {
        elem.setAttribute('disabled', 'true');
      }
    });
  }

  // let animate = ({duration, draw, timing}) => {

  //   let start = performance.now();
    
  //   requestAnimationFrame(function animate(time) {
  //     let timeFraction = (time - start) / duration;
  //     let progress;

  //     if(timeFraction < 0.7) {
  //       progress = timing(2 * timeFraction);
  //     } else if(timeFraction > 0.7) {
  //       progress = timing(timeFraction);
  //       // progress = (2 - timing(2 * (1 - timeFraction))) / 2;
  //     }

  //     draw(progress, timeFraction);
  
  //     if (timeFraction < 1) {
  //       requestAnimationFrame(animate);
  //     }
  
  //   });
  // }

    
  const minNumber = document.getElementById('minNumber'),
        maxNumber = document.getElementById('maxNumber'),
        startBtn = document.getElementById('start'),
        setRangeNumber = document.getElementById('setRangeNumber'),
        output = document.getElementById('output'),
        reset = document.getElementById('reset'),
        exclude = document.getElementById('exclude'),
        winNumber = document.getElementById('winNumber'),
        drumWrapper = document.querySelector('.drum__wrapper'),
        resetAll = document.getElementById('resetAll'),
        resetList = document.getElementById('resetList'),
        addWinNumber = document.getElementById('addWinNumber'),
        numberWinnersValue = document.getElementById('numberWinnersValue'),
        speedValue = document.getElementById('speedValue'),
        durValue = document.getElementById('durValue');

  let rangeData = [],
      randNum,
      rouletter,
      options,
      indexNumber;


      options = {
        speed : speedValue.value,
        duration : durValue.value,
        stopImageNumber : 0,
        startCallback : function() {
          startBtn.setAttribute('disabled', 'true');
        },

        slowDownCallback : function() {

        },
        stopCallback : function() {
          startBtn.removeAttribute('disabled');
          document.querySelector('.winnerBg').classList.add('active');
          setTimeout(() => {
            document.querySelector('.winnerBg').classList.remove('active');
          }, 10000)
        }
      }

      if(localStorage.getItem('winNumber') !== null) {
        winNumber.textContent = localStorage.getItem('winNumber');
      }


      speedValue.addEventListener('input', () => {
        options['speed'] = speedValue.value;
        rouletter.roulette('option', options);
      })
      durValue.addEventListener('input', () => {
        options['duration'] = durValue.value;
        rouletter.roulette('option', options);
      })
  // Добавление диапозона чисел
  const setData = (min, max) => {
    // rangeData = [];
    for (let number = min; number < max + 1; number++) {
      rangeData.push(number);
    }
    // Добавление номеров в барабан
    rangeData.forEach((num, i) => {
      const drumItem = document.createElement('div'),
      number = document.createElement('span');
  
      number.textContent = num;
      drumItem.classList.add('drum__item');
      drumItem.setAttribute('data-id', num);
      drumWrapper.insertAdjacentElement('beforeend', drumItem);
      drumItem.insertAdjacentElement('beforeend', number);
    });

    $('.options').slideUp();

    rouletter = $('div.drum__wrapper');
    rouletter.roulette(options);
  }


  // Слушатели
  setRangeNumber.addEventListener('click', () => {
    if(isNumber(minNumber.value) && minNumber !== '' && isNumber(maxNumber.value) && maxNumber !== '') {
      setData(+minNumber.value, +maxNumber.value);
      startBtn.removeAttribute('disabled');
      // isDisabled(minNumber, maxNumber, setRangeNumber);
    }

    excludeNumber(exclude.value);
    
  });

  const updateParamater = (index) => {
    options['stopImageNumber'] = index;
    rouletter.roulette('option', options);
  }



  // Выборка чисел
  startBtn.addEventListener('click', () => {

    let randNum = getRundomNumber(0);
    if(rangeData.length > 0) {
      rangeData.forEach((num, i) => {

        if(randNum === i) {
          // output.textContent = rangeData[i];
          winNumber.textContent += rangeData[i] + ',';
          localStorage.setItem('winNumber', winNumber.textContent);
          rangeData.splice(i, 1);
          if(drumWrapper.childNodes[0].childNodes.length > 0) {
            drumWrapper.childNodes[0].childNodes.forEach((item, ind) => {
              if(num === +item.dataset.id) {
                indexNumber = ind;
              }
            });
          } else {
            drumWrapper.childNodes.forEach((item, ind) => {
              if(num === +item.dataset.id) {
                indexNumber = ind;
              }
            });
          }
        }
      });

      updateParamater(indexNumber);
      rouletter.roulette('start');
    }else {
      console.error('Числа закончились :(');
      // output.textContent = 'Числа закончились :(';
    }

  });
  
  // Случайный индекс
  const getRundomNumber = (min) => {
    let n = Math.floor(Math.random() * (rangeData.length - min) + min)
    return n;
  }

  const excludeNumber = (numbers) => {
    let array = numbers.split(',')
    array.forEach(num => {
      rangeData.forEach((number, i) => {
        if(number === +num) {
          rangeData.splice(i, 1);
        }
      });
    });
  }

  // Сброс
  reset.addEventListener('click', () => {
    rangeData = [];
    // isDisabled(minNumber, maxNumber, setRangeNumber);
    minNumber.value = '';
    maxNumber.value = '';
    // output.textContent = '';
    // drumWrapper.innerHTML = '';
    exclude.value = '';
  });

  resetAll.addEventListener('click', () => {
    rangeData = [];
    // isDisabled(minNumber, maxNumber, setRangeNumber);
    minNumber.value = '';
    maxNumber.value = '';
    // output.textContent = '';
    drumWrapper.innerHTML = '';
    // localStorage.removeItem('winNumber');
    exclude.value = '';
    // winNumber.textContent = '';
    window.location.reload();
  })

  resetList.addEventListener('click', () => {
    localStorage.removeItem('winNumber');
    winNumber.textContent = '';
    window.location.reload();
  })


  addWinNumber.addEventListener('click', () => {
    exclude.value = winNumber.textContent;
  });

  // $('.options').hide();
  $('#toggleOptions').on('click', () => {
    $('.options').slideToggle()
  })


});

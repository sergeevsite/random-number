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



  const minNumber = document.getElementById('minNumber'),
        maxNumber = document.getElementById('maxNumber'),
        startBtn = document.getElementById('start'),
        setRangeNumber = document.getElementById('setRangeNumber'),
        output = document.getElementById('output'),
        reset = document.getElementById('reset'),
        exclude = document.getElementById('exclude'),
        winNumber = document.getElementById('winNumber');
  let rangeData = [],
      randNum;

  // Добавление диапозона чисел
  const setData = (min, max) => {
    rangeData = [];
    for (let number = min; number < max + 1; number++) {
      rangeData.push(number);
    }
  }

  // Слушатели
  setRangeNumber.addEventListener('click', () => {
    if(isNumber(minNumber.value) && minNumber !== '' && isNumber(maxNumber.value) && maxNumber !== '') {
      setData(+minNumber.value, +maxNumber.value);
      startBtn.removeAttribute('disabled');
      isDisabled(minNumber, maxNumber, setRangeNumber);
    }

    excludeNumber(exclude.value);
  });

  // Выборка чисел
  startBtn.addEventListener('click', () => {
    let randNum = getRundomNumber(0);
    if(rangeData.length > 0) {
      rangeData.forEach((num, i) => {
        if(randNum === i) {
          output.textContent = rangeData[i];
          winNumber.textContent += rangeData[i] + ',';
          rangeData.splice(i, 1);
        }
      });
    }else {
      output.textContent = 'Заполните диапозон чисел';
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
    isDisabled(minNumber, maxNumber, setRangeNumber);
    minNumber.value = '';
    maxNumber.value = '';
    output.textContent = '';
  });
  

});

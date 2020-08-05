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

  let animate = ({duration, draw, timing}) => {

    let start = performance.now();
    
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      let progress;

      if(timeFraction < 0.7) {
        progress = timing(2 * timeFraction);
      } else if(timeFraction > 0.7) {
        progress = timing(timeFraction);
        // progress = (2 - timing(2 * (1 - timeFraction))) / 2;
      }

      draw(progress, timeFraction);
  
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
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
        winNumber = document.getElementById('winNumber'),
        drumWrapper = document.querySelector('.drum__wrapper');
  let rangeData = [],
      randNum;

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

          drumWrapper.childNodes.forEach((item) => {
            if(num === +item.dataset.id) {
              let s = item.getBoundingClientRect().top - item.parentNode.getBoundingClientRect().top;

              animate({
                duration: 10000,
                timing(timeFraction) {
                  return timeFraction;
                  // if(timeFraction <= 0.7) {
                  //   return timeFraction * 2;
                  // } else {
                  //   return timeFraction;
                  // }
                },
                draw(progress, timeFraction) {
                  if(timeFraction < 0.7) {
                    if(progress > 0.8) {
                      drumWrapper.style.transform = `translateY(-${(progress * (drumWrapper.getBoundingClientRect().height - 2000)) / 2}px)`;
                    } else {
                      drumWrapper.style.transform = `translateY(-${progress * drumWrapper.getBoundingClientRect().height}px)`;
                    }
                  } else {
                    drumWrapper.style.transform = `translateY(-${progress * s}px)`;
                  }
                  // if(progress < 1) {
                  //   drumWrapper.style.transform = `translateY(-${progress * drumWrapper.getBoundingClientRect().height}px)`;
                  // } else {
                  //   drumWrapper.style.transform = `translateY(-${progress * s}px)`;
                  // }
                }
              });

            }
          });
        }
        
      });

    }else {
      output.textContent = 'Числа закончились :(';
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
    drumWrapper.innerHTML = '';
  });
    

});

// рассчет стоимости трагедии в зависимости от количества зрителей:
// для аудитории <=30 фиксированно 40000
// если больше 30, то дополнительно 10000 за каждого сверх 30
const calcAmountTragedy = (audience) => {
  let amount = 40000;
  if (audience > 30) {
    amount += 1000 * (audience - 30);
  }
  return amount;
};

// стоимости комедии в зависимости от количества зрителей:
// для аудитории <=20 фиксированно 30000 плюс 300 за каждого зрителя
// если больше 20, то дополнительно 10000 плюс 500 за каждого зрителя сверх 20
const calcAmountComedy = (audience) => {
  let amount = 30000;
  if (audience > 20) {
    amount += 10000 + 500 * (audience - 20);
  }
  amount += 300 * audience;
  return amount;
};

// рассчеты для одного выступления
const calcAmountPlay = (play) => {
  let amount = 0;
  let bonus = 0;

  switch (play.type) {
    case "tragedy":
      amount = calcAmountTragedy(play.audience);
      break;
    case "comedy":
      amount = calcAmountComedy(play.audience);
      // Дополнительный бонус за каждого 5 зрителя
      bonus += Math.floor(play.audience / 5);
      break;
    default:
      throw new Error(`неизвестный тип: ${play.type}`);
  }

  // Добавление бонуса за каждого зрителя > 30
  bonus += Math.max(play.audience - 30, 0);

  return {
    name: play.playId,
    amount,
    audience: play.audience,
    bonus,
  };
};

// рассчеты для всего заказа
const calcAmountOrder = (plays) => {
  const arrPlays = plays.map((play) => {
    return calcAmountPlay(play);
  });

  const { amount: totalAmount, bonus: totalBonus } = arrPlays.reduce(
    (acc, play) => {
      acc.bonus += play.bonus;
      acc.amount += play.amount;
      return acc;
    },
    { amount: 0, bonus: 0 }
  );

  return {
    totalAmount,
    totalBonus,
    arrPlays,
  };
};

// счет заказа
const invoiceOrder = (invoice) => {
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format;

  const { totalAmount, totalBonus, arrPlays: plays } = calcAmountOrder(
    invoice.performances
  );

  // Вывод строки счета
  let result = `Счет для ${invoice.customer}\n`;
  plays.forEach((play) => {
    result += `${play.name}: ${format(play.amount)}`;
    result += ` (${play.audience} мест)\n`;
  });
  result += `Итого с Вас ${format(totalAmount)}\n`;
  result += `Вы заработали ${totalBonus} бонусов\n`;
  return result;
};

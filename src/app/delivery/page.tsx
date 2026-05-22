export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-wider">
        Доставка и оплата
      </h1>

      <div className="space-y-10">
        {/* Delivery */}
        <section>
          <h2 className="text-xl font-bold mb-4">Способы доставки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">По Минску</h3>
              <p className="text-sm text-muted-foreground">
                Доставка курьером в пределах МКАД. Срок — 1-2 рабочих дня.
                Стоимость рассчитывается индивидуально в зависимости от
                габаритов и веса изделия.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">По Беларуси</h3>
              <p className="text-sm text-muted-foreground">
                Отправка через Белпочту или Европочту. Срок — 3-7 рабочих дней
                в зависимости от региона. Возможна доставка до двери.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">В Россию</h3>
              <p className="text-sm text-muted-foreground">
                Отправка через СДЭК или Почту России. Срок — от 5 рабочих дней.
                Отслеживание посылки на всем пути следования.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Самовывоз</h3>
              <p className="text-sm text-muted-foreground">
                Самовывоз из пункта выдачи в Минске. Адрес уточняется при
                оформлении заказа. Предварительно необходимо согласовать время.
              </p>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-xl font-bold mb-4">Способы оплаты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Банковская карта</h3>
              <p className="text-sm text-muted-foreground">
                Оплата онлайн банковской картой через защищенный платежный
                шлюз. Принимаются карты Visa, Mastercard, Мир.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Наложенный платеж</h3>
              <p className="text-sm text-muted-foreground">
                Оплата при получении в отделении почты или курьеру. Доступно
                для отправлений по Беларуси.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Безналичный расчет</h3>
              <p className="text-sm text-muted-foreground">
                Для юридических лиц и ИП. Выставляется счет на оплату. Полный
                пакет закрывающих документов.
              </p>
            </div>
          </div>
        </section>

        {/* Return */}
        <section>
          <h2 className="text-xl font-bold mb-4">Возврат и обмен</h2>
          <p className="text-muted-foreground leading-relaxed">
            Возврат и обмен товара осуществляется в соответствии с
            законодательством Республики Беларусь. Товар надлежащего качества
            можно вернуть в течение 14 дней с момента получения при сохранении
            товарного вида и упаковки. Возврат товара ненадлежащего качества
            осуществляется в течение гарантийного срока.
          </p>
        </section>
      </div>
    </div>
  );
}
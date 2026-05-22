import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-wider">
        Контакты
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
        {/* Form */}
        <div>
          <h2 className="text-xl font-bold mb-4">Связаться с нами</h2>
          <ContactForm />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Контактная информация</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Телефон</h3>
              <a
                href="tel:+375291234567"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                +375 (29) 123-45-67
              </a>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Email</h3>
              <a
                href="mailto:info@caggiati.by"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                info@caggiati.by
              </a>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Адрес</h3>
              <p className="text-muted-foreground">
                Республика Беларусь, г. Минск
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Режим работы</h3>
              <p className="text-muted-foreground">Пн–Пт: 9:00 – 18:00</p>
              <p className="text-muted-foreground">Сб: 10:00 – 15:00</p>
              <p className="text-muted-foreground">Вс: выходной</p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Реквизиты</h3>
              <p className="text-muted-foreground text-sm">
                ИП Логовской Н.С.
              </p>
              <p className="text-muted-foreground text-sm">
                УНП 193456789
              </p>
              <p className="text-muted-foreground text-sm">
                Республика Беларусь
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
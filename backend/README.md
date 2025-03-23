📌 Gestión de Citas Médicas - Plataforma Web

📖 Descripción del Proyecto

Este proyecto es una aplicación web diseñada para la gestión de citas médicas, enfocada principalmente en administradores. La plataforma permite:

✅ Crear, modificar y eliminar información relacionada con médicos, usuarios, tipos de citas y horarios médicos.<br>
✅ Organizar citas según criterios como duración, precio y especialidad médica.<br>
✅ Optimizar el proceso de gestión de citas en entornos médicos.<br>

🏥 Usuario Administrador<br>
🔹Email: Shadowhearts@gmail.com<br>
🔹Password: Puppetmaster.9<br>

🏥 Funcionamiento

🔹 Administradores: Configuran la plataforma ingresando médicos, tipos de citas, horarios y demás información relevante.<br>
🔹 Pacientes: Se registran en la aplicación, buscan citas disponibles según especialidad y fecha, y pueden agendar y pagar citas mediante Mercado Pago.<br>
🔹 Médicos: Pueden registrar historiales médicos de sus pacientes y visualizar sus citas programadas.<br>
🔹 Historial Médico: Los pacientes pueden revisar diagnósticos, medicamentos recetados y notas del médico.<br>

🛠 Tecnologías Utilizadas

🚀 Frontend<br>
    Angular: Framework para aplicaciones web dinámicas.
    Bootstrap 5: Estilos responsivos para mejorar la interfaz de usuario.
    Angular Material: Componentes UI basados en Material Design.

💾 Backend<br>
    TypeScript: Lenguaje tipado que mejora la robustez del código.
    Node.js: Entorno de ejecución para JavaScript en el servidor.
    Express: Framework ligero para la construcción de APIs.
    Sequelize: ORM para manejar bases de datos SQL como MySQL.

⚠ IMPORTANTE: LEER ANTES DE REVISAR EL PROYECTO
1️⃣ Ejecutar Angular con conexión a Internet<br>

Antes de ejecutar el frontend con Angular, asegúrese de estar conectado a Internet.
Esto es necesario porque el proyecto utiliza el CDN de Bootstrap, y sin conexión las interfaces se verán sin estilos.

Comandos para ejecutar Angular:

npm install
ng serve

2️⃣ Simulación de pagos con Mercado Pago<br>

Para probar la compra de citas médicas, se debe usar ngrok para generar un enlace público, ya que el backend se ejecuta localmente.

📌 Generar un enlace público con ngrok<br>

Una vez que el backend esté corriendo en el puerto 8000, ejecute el siguiente comando en la terminal:

.\ngrok.exe http 8000

Esto generará un enlace similar a:<br>

https://702b-2800-150-14e-fe7-94e6-e2dd-926e-ad09.ngrok.io

🔹 Configurar la URL en Mercado Pago<br>
Este enlace debe actualizarse en el controlador controller/mercadoPago, dentro de la variable notification_url:

notification_url: "https://702b-2800-150-14e-fe7-94e6-e2dd-926e-ad09.ngrok.io/api/mercadoPago/webhook"

⚠ Nota:<br>
Cada vez que se cierre el backend en el puerto 8000, la URL generada por ngrok expirará. Debe repetirse este proceso cada vez que se reinicie el proyecto.
3️⃣ Acceso a Mercado Pago con un usuario de prueba<br>

Antes de probar la compra, debe iniciar sesión en Mercado Pago con un usuario de prueba.

📌 Instrucciones<br>

    Acceda a la página de prueba de Mercado Pago:
    🔗 Mercado Pago Developers
    Haga clic en "Ingresar" en la esquina superior derecha.
    Use las siguientes credenciales:

    Usuario: TESTUSER90381648
    Contraseña: tCfitcy8wl

📌 Ingresar tarjetas de prueba<br>
Para realizar pagos simulados, use tarjetas de prueba.
🔗 Tarjetas de prueba de Mercado Pago

Ejemplo de tarjeta de prueba Visa:<br>

Número: 4023 6535 2391 4373
Código de seguridad: 123
Fecha de caducidad: 11/25
Titular: "APRO" (para pagos aprobados) o "OTHE" (para pagos rechazados)

🔥 Ejecución del Proyecto<br>
🚀 Iniciar el Frontend (Angular)<br>

```bash
npm install
ng serve
```

🔧 Iniciar el Backend (Node.js)<br>
```bash
nodemon dist/app.js
```

Para asegurarse de que los cambios en TypeScript se reflejen en el código JavaScript, ejecute:
```bash
tsc --watch
```
⚠ Importante:<br>
Antes de cambiar la notification_url en Mercado Pago para probar la compra de una cita médica, asegúrese de ejecutar tsc --watch.

📩 Contacto<br>

Para más información sobre el proyecto, puede contactar al desarrollador:
📧 Correo: smoralespincheira@gmail.com

🎯 Conclusión<br>
Este README proporciona una guía detallada sobre la configuración y ejecución del proyecto, asegurando que puedas probar todas sus funcionalidades sin inconvenientes. 🚀💻

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-10-09 20:19:18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 226 (class 1259 OID 16555)
-- Name: customers_customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_customers_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16522)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    customers_id integer DEFAULT nextval('public.customers_customers_id_seq'::regclass) NOT NULL,
    customers_name character varying(100) NOT NULL,
    customers_surname character varying(100) NOT NULL,
    customers_address_one character varying(255) NOT NULL,
    customers_address_two character varying(255),
    customers_email character varying(100) NOT NULL,
    customers_phone character varying(10) NOT NULL,
    customers_provinces_cod integer NOT NULL,
    customers_cp character varying(5) NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16553)
-- Name: orderproducts_orderproducts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orderproducts_orderproducts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orderproducts_orderproducts_id_seq OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16510)
-- Name: orderproducts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderproducts (
    orderproducts_id integer DEFAULT nextval('public.orderproducts_orderproducts_id_seq'::regclass) NOT NULL,
    orderproducts_name character varying(255) NOT NULL,
    orderproducts_quantity integer NOT NULL,
    orderproducts_price numeric(10,2) NOT NULL,
    orderproducts_subtotal numeric(10,2) NOT NULL,
    orderproducts_orders_id integer,
    orderproducts_products_id integer
);


ALTER TABLE public.orderproducts OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16477)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    orders_id integer NOT NULL,
    orders_date date NOT NULL,
    orders_total numeric(10,2) NOT NULL,
    orders_number character varying(50) NOT NULL,
    orders_customers_id integer NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16475)
-- Name: orders_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_orders_id_seq OWNER TO postgres;

--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 221
-- Name: orders_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_orders_id_seq OWNED BY public.orders.orders_id;


--
-- TOC entry 218 (class 1259 OID 16437)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    posts_id integer NOT NULL,
    posts_title character varying(150) NOT NULL,
    posts_users_id integer NOT NULL,
    posts_date date NOT NULL,
    posts_content text NOT NULL,
    posts_author character varying(250) NOT NULL,
    posts_image_url character varying(250)
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16436)
-- Name: posts_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_posts_id_seq OWNER TO postgres;

--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 217
-- Name: posts_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_posts_id_seq OWNED BY public.posts.posts_id;


--
-- TOC entry 220 (class 1259 OID 16465)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    products_id integer NOT NULL,
    products_name character varying(255) NOT NULL,
    products_description text NOT NULL,
    products_price numeric(6,2) NOT NULL,
    products_image_url character varying(255),
    products_stock integer NOT NULL,
    products_category character varying(45) NOT NULL,
    products_is_active boolean DEFAULT true
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16464)
-- Name: products_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_products_id_seq OWNER TO postgres;

--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 219
-- Name: products_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_products_id_seq OWNED BY public.products.products_id;


--
-- TOC entry 228 (class 1259 OID 16583)
-- Name: provinces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinces (
    provinces_id integer NOT NULL,
    provinces_name character varying(150) NOT NULL,
    provinces_cod integer NOT NULL
);


ALTER TABLE public.provinces OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16582)
-- Name: provinces_provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.provinces_provinces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provinces_provinces_id_seq OWNER TO postgres;

--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 227
-- Name: provinces_provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provinces_provinces_id_seq OWNED BY public.provinces.provinces_id;


--
-- TOC entry 216 (class 1259 OID 16420)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    users_id integer NOT NULL,
    users_name character varying(80) NOT NULL,
    users_lastname_one character varying(80) NOT NULL,
    users_lastname_two character varying(80) NOT NULL,
    users_email character varying(80) NOT NULL,
    users_role character varying(15) NOT NULL,
    users_password character varying(60) NOT NULL,
    users_is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16419)
-- Name: users_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_users_id_seq OWNER TO postgres;

--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_users_id_seq OWNED BY public.users.users_id;


--
-- TOC entry 4723 (class 2604 OID 16480)
-- Name: orders orders_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN orders_id SET DEFAULT nextval('public.orders_orders_id_seq'::regclass);


--
-- TOC entry 4720 (class 2604 OID 16440)
-- Name: posts posts_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN posts_id SET DEFAULT nextval('public.posts_posts_id_seq'::regclass);


--
-- TOC entry 4721 (class 2604 OID 16468)
-- Name: products products_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN products_id SET DEFAULT nextval('public.products_products_id_seq'::regclass);


--
-- TOC entry 4726 (class 2604 OID 16586)
-- Name: provinces provinces_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces ALTER COLUMN provinces_id SET DEFAULT nextval('public.provinces_provinces_id_seq'::regclass);


--
-- TOC entry 4718 (class 2604 OID 16423)
-- Name: users users_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN users_id SET DEFAULT nextval('public.users_users_id_seq'::regclass);


--
-- TOC entry 4919 (class 0 OID 16522)
-- Dependencies: 224
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (customers_id, customers_name, customers_surname, customers_address_one, customers_address_two, customers_email, customers_phone, customers_provinces_cod, customers_cp) FROM stdin;
25	Ainhoa	Alonso Sanchez	Calle de utrillas 17, 3A		ainhoaalonso88@gmail.com	645973844	28	28043
\.


--
-- TOC entry 4918 (class 0 OID 16510)
-- Dependencies: 223
-- Data for Name: orderproducts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderproducts (orderproducts_id, orderproducts_name, orderproducts_quantity, orderproducts_price, orderproducts_subtotal, orderproducts_orders_id, orderproducts_products_id) FROM stdin;
20	Pulverizador de Cristal de 500 ml	1	6.99	6.99	23	96
21	Set de Limpieza de Cocina Brushboo Eco	2	12.99	25.98	23	97
22	Cesta de Mimbre para Ropa	1	29.99	29.99	24	99
\.


--
-- TOC entry 4917 (class 0 OID 16477)
-- Dependencies: 222
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (orders_id, orders_date, orders_total, orders_number, orders_customers_id) FROM stdin;
23	2024-10-09	32.97	ORD-1728478889745	25
24	2024-10-09	29.99	ORD-1728480976752	25
\.


--
-- TOC entry 4913 (class 0 OID 16437)
-- Dependencies: 218
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (posts_id, posts_title, posts_users_id, posts_date, posts_content, posts_author, posts_image_url) FROM stdin;
23	5 Consejos para Mantener tu Hogar Limpio y Organizado	9	2024-10-07	<p>El desorden puede convertirse en una fuente de estrés en nuestra vida diaria. Mantener un hogar limpio y organizado no solo mejora nuestro estado de ánimo, sino que también facilita las tareas cotidianas. Aquí te comparto cinco consejos prácticos que te ayudarán a lograr un espacio más ordenado y armonioso.</p>\r\n<h4>1. <strong>Establece un Sistema de Organización</strong></h4>\r\n<p>El primer paso para un hogar organizado es establecer un sistema que funcione para ti. Considera categorizar tus pertenencias: ropa, documentos, productos de limpieza, etc. Utiliza etiquetas en cajas y estantes para que todos sepan dónde va cada cosa. Este método no solo te ayudará a encontrar rápidamente lo que necesitas, sino que también hará que sea más fácil devolver cada objeto a su lugar.</p>\r\n<h4>2. <strong>Deshazte de lo Innecesario</strong></h4>\r\n<p>Antes de empezar a organizar, revisa cada área de tu hogar y pregúntate si realmente necesitas cada objeto. Si no has utilizado algo en más de un año, probablemente sea el momento de deshacerte de él. Puedes vender, donar o reciclar esos objetos que ya no te sirven. Este proceso te ayudará a reducir el desorden y a crear un ambiente más tranquilo.</p>\r\n<h4>3. <strong>Implementa la Regla de "Un Entrada, Una Salida"</strong></h4>\r\n<p>Cada vez que adquieras un nuevo objeto, considera deshacerte de uno antiguo. Esta regla simple te ayudará a mantener tu hogar libre de acumulaciones innecesarias. Así, cada nuevo artículo que traigas a casa no aumentará el desorden, sino que equilibrará el espacio.</p>\r\n<h4>4. <strong>Crea Rutinas de Limpieza Diarias</strong></h4>\r\n<p>Dedica unos minutos cada día a realizar pequeñas tareas de limpieza. Hacer la cama, lavar los platos o recoger los objetos fuera de lugar puede hacer una gran diferencia. Estas pequeñas rutinas no solo mantendrán tu hogar limpio, sino que también te ayudarán a evitar la acumulación de tareas más grandes a lo largo del tiempo.</p>\r\n<h4>5. <strong>Involucra a Todos en el Proceso</strong></h4>\r\n<p>Si vives con familiares o compañeros de cuarto, asegúrate de involucrarlos en el proceso de organización y limpieza. Asigna responsabilidades y tareas específicas para que todos contribuyan. Esto no solo aliviará tu carga, sino que también fomentará un sentido de responsabilidad compartida en el hogar.</p>\r\n<p>Mantener un hogar ordenado y limpio es un compromiso continuo, pero con estos consejos, puedes crear un espacio más agradable y funcional. Recuerda que un entorno ordenado no solo mejora la estética de tu hogar, sino que también te proporciona un lugar donde puedes relajarte y disfrutar. ¡Comienza hoy y transforma tu espacio!&nbsp;</p>\r\n	Ainhoa Alonso	https://i.ibb.co/M7gd8Xz/organizacion.jpg
24	Guía Práctica para Hacer un Cambio de Armario sin Estrés	9	2024-10-08	<p>La llegada de una nueva temporada es la oportunidad perfecta para realizar un cambio de armario. Organizar tu ropa no solo te ayudará a encontrar lo que necesitas más fácilmente, sino que también te permitirá liberar espacio y descubrir prendas olvidadas. Aquí tienes una guía paso a paso para hacer un cambio de armario eficaz y sin estrés.</p>\r\n<h4><strong>1. Planifica el Momento</strong></h4>\r\n<p>Elige un día específico y asegúrate de tener tiempo suficiente para realizar el cambio sin prisas. Un fin de semana o un día libre puede ser ideal. Asegúrate de tener a mano bolsas, cajas y espacio suficiente para trabajar.</p>\r\n<h4><strong>2. Vacía el Armario</strong></h4>\r\n<p>Saca toda la ropa de tu armario. Esto te permitirá ver claramente lo que tienes y te dará la oportunidad de limpiar a fondo el espacio. Aprovecha para limpiar las estanterías y el suelo del armario.</p>\r\n<h4><strong>3. Clasifica la Ropa</strong></h4>\r\n<p>Divide tu ropa en varias categorías:</p>\r\n<ul>\r\n<li><strong>Mantener:</strong> Prendas que usas regularmente y que están en buen estado.</li>\r\n<li><strong>Donar/Vender:</strong> Ropa que ya no usas, está en buen estado y puede tener una segunda vida.</li>\r\n<li><strong>Desechar:</strong> Ropa dañada o en muy mal estado que no puede ser donada.</li>\r\n</ul>\r\n<h4><strong>4. Revisa las Temporadas</strong></h4>\r\n<p>Al hacer el cambio de armario, es el momento perfecto para separar la ropa de temporada. Guarda la ropa de verano si es otoño/invierno, y viceversa. Considera usar cajas de almacenamiento para guardar la ropa que no se utilizará en la temporada actual.</p>\r\n<h4><strong>5. Evalúa tu Estilo y Necesidades</strong></h4>\r\n<p>Es posible que algunas prendas ya no se ajusten a tu estilo o que no las uses. Pregúntate si cada prenda realmente te gusta y si la usarías. Si tienes dudas, prueba las prendas y decide en base a cómo te sientes.</p>\r\n<h4><strong>6. Organiza por Categorías</strong></h4>\r\n<p>Una vez que hayas decidido qué mantener, organiza tu ropa. Puedes clasificarla por:</p>\r\n<ul>\r\n<li><strong>Tipo:</strong> camisas, pantalones, vestidos, etc.</li>\r\n<li><strong>Color:</strong> esto no solo se ve bonito, sino que también facilita la elección.</li>\r\n<li><strong>Frecuencia de uso:</strong> coloca las prendas que usas más a menudo al frente.</li>\r\n</ul>\r\n<h4><strong>7. Almacena Correctamente</strong></h4>\r\n<p>Asegúrate de que la ropa se almacene adecuadamente para evitar arrugas y daños. Utiliza perchas adecuadas para cada tipo de prenda. Las camisetas pueden doblarse y guardarse en estantes. Usa cajas o bolsas de almacenamiento para las prendas de temporada que no necesites.</p>\r\n<h4><strong>8. Mantén el Espacio Limpio y Ordenado</strong></h4>\r\n<p>Antes de volver a colocar la ropa en el armario, aprovecha para limpiar el interior del armario. Usa un paño húmedo para quitar el polvo y asegúrate de que todo esté en orden.</p>\r\n<h4><strong>9. Haz una Lista de Necesidades</strong></h4>\r\n<p>Después de reorganizar tu armario, haz una lista de las prendas que necesitas para complementar tu guardarropa. Esto te ayudará a hacer compras más inteligentes en el futuro y evitar compras impulsivas.</p>\r\n<h4><strong>10. Establece una Rutina de Revisión</strong></h4>\r\n<p>Haz un hábito de revisar tu armario al menos dos veces al año. Esto te ayudará a mantener el orden y evitar el acumulamiento de ropa innecesaria.&nbsp;</p>\r\n<p>Hacer un cambio de armario puede parecer una tarea abrumadora, pero con una buena planificación y organización, puedes transformar tu armario en un espacio funcional y agradable. Recuerda que un armario bien organizado no solo ahorra tiempo en tus elecciones diarias, sino que también mejora tu estilo y bienestar. ¡Empieza tu cambio de armario hoy y disfruta de la frescura de una nueva temporada!&nbsp;</p>\r\n<p></p>\r\n	Ainhoa Alonso	https://i.ibb.co/LNXhP7K/cambio-armario.jpg
\.


--
-- TOC entry 4915 (class 0 OID 16465)
-- Dependencies: 220
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (products_id, products_name, products_description, products_price, products_image_url, products_stock, products_category, products_is_active) FROM stdin;
96	Pulverizador de Cristal de 500 ml	El pulverizador de cristal de 500 ml es perfecto para aplicar soluciones de limpieza o productos de jardinería de manera uniforme. Fabricado en cristal resistente, es una alternativa sostenible y reutilizable a los pulverizadores plásticos. Ideal para usar en el hogar, en la limpieza de ventanas, o para rociar plantas.\r\n\r\nMedidas:\r\n\r\nAltura: 22 cm\r\nDiámetro: 7 cm	6.99	https://i.ibb.co/Q60ZVcF/pulverizador-cristal-500.jpg	74	Limpieza	t
98	Trapos de Cocina Multiusos	Estos trapos de cocina multiusos son ideales para todas tus necesidades de limpieza. Están hechos de un material absorbente y duradero que elimina la suciedad y el polvo de manera eficaz. Su textura suave los hace perfectos para limpiar cualquier superficie sin rayarla, incluyendo encimeras, utensilios y electrodomésticos.\r\nMedidas:\r\n\r\nTamaño: 35 cm x 35 cm\r\nPaquete de 3 unidades.	5.99	https://i.ibb.co/0Xv9QBL/trapos-cocina.jpg	119	Limpieza	t
100	Contenedor Plástico con Tapa de 46L	Este contenedor de plástico de 46 litros es ideal para el almacenamiento de juguetes, ropa, o cualquier otro tipo de artículos del hogar. Su tapa ajustada mantiene el contenido a salvo del polvo y la humedad, y su diseño apilable permite maximizar el espacio en armarios y trasteros.\r\n\r\nMedidas:\r\n\r\nTamaño: 60 cm (largo) x 40 cm (ancho) x 30 cm (alto)	18.50	https://i.ibb.co/QHyM2QZ/contenedor-plastico-tapa-46l.jpg	199	Organización Hogar	t
101	Organizador de 9 Compartimentos	Este organizador cuenta con 9 compartimentos que te permitirán mantener tus accesorios, juguetes o artículos de manualidades perfectamente ordenados. Su diseño modular se adapta a cualquier espacio y facilita el acceso a tus pertenencias. Ideal para usar en el hogar, oficina o en el estudio.\r\n\r\nMedidas:\r\n\r\nTamaño: 30 cm (alto) x 40 cm (ancho) x 25 cm (profundidad)	24.99	https://i.ibb.co/ZV1ZJz4/organizador-9-compartimentos.jpg	150	Organización Hogar	t
102	Organizador de Cajones para Cocina	Maximiza el espacio en tus cajones de cocina con este organizador. Diseñado para ajustarse a diferentes tamaños de cajones, cuenta con divisores ajustables que permiten almacenar utensilios, cubiertos y pequeños electrodomésticos de manera ordenada.\r\n\r\nMedidas:\r\n\r\nTamaño: 10 cm (alto) x 30 cm (ancho) x 40 cm (profundidad)	19.99	https://i.ibb.co/RBjyt3M/organizador-cajones-cocina.jpg	120	Organización Hogar	t
103	Organizadores de Zapatos	Mantén tus zapatos organizados y en perfecto estado con estos organizadores. Cada unidad permite almacenar hasta 6 pares de zapatos, evitando el desorden en el armario. Su diseño transparente te permite ver fácilmente el contenido y elegir el par que deseas.\r\n\r\nMedidas:\r\n\r\nTamaño: 25 cm (alto) x 35 cm (ancho) x 30 cm (profundidad)	34.99	https://i.ibb.co/G39CxMc/organizadores-zapatos.jpg	80	Organización Hogar	t
104	Set de Cajas Organizadoras	Este set incluye 3 cajas organizadoras de diferentes tamaños, ideales para almacenar ropa, juguetes o artículos de oficina. Con un diseño elegante y funcional, se apilan fácilmente para ahorrar espacio. Cada caja cuenta con una tapa para mantener el contenido protegido y limpio.\r\n\r\nMedidas:\r\n\r\nTamaños:\r\nPequeña: 20 cm (alto) x 30 cm (ancho) x 20 cm (profundidad)\r\nMediana: 25 cm (alto) x 40 cm (ancho) x 25 cm (profundidad)\r\nGrande: 30 cm (alto) x 50 cm (ancho) x 30 cm (profundidad)	8.99	https://i.ibb.co/WvrdSz8/set-cajas-organizadoras.jpg	100	Organización Hogar	t
105	Caja de Escritorio de Bambú	Organiza tu espacio de trabajo con esta elegante caja de escritorio de bambú. Con un diseño minimalista, esta caja es perfecta para almacenar bolígrafos, lápices, notas adhesivas y otros suministros de oficina. Su material ecológico no solo aporta un toque natural, sino que también es durable y fácil de limpiar. Ideal para el hogar o la oficina, manteniendo todo a la mano y con estilo.\r\n\r\nMedidas:\r\n\r\nTamaño: 10 cm (alto) x 30 cm (ancho) x 15 cm (profundidad)	22.99	https://i.ibb.co/HCK6DLh/caja-escritorio-bambu.jpg	50	Organización Oficina	t
106	Organizador de Metal de 4 Niveles	Este organizador de metal de 4 niveles es ideal para maximizar el espacio en tu escritorio o área de trabajo. Con un diseño robusto y moderno, permite almacenar documentos, carpetas y otros suministros de oficina de manera ordenada y accesible. Su estructura metálica garantiza durabilidad y estabilidad, mientras que su acabado elegante complementa cualquier entorno.\r\n\r\nMedidas:\r\n\r\nTamaño: 40 cm (alto) x 30 cm (ancho) x 25 cm (profundidad)	19.99	https://i.ibb.co/86QDq7v/organizador-metal-4-niveles.jpg	25	Organización Oficina	t
94	Botella de 500 ml con Dispensador	Una práctica botella con dispensador de 500 ml, ideal para almacenar y dosificar líquidos como jabones, aceites, o productos de limpieza. Su diseño compacto y su sistema de bombeo te permiten extraer el contenido de manera fácil y sin desperdicio. Además, su tamaño es perfecto para cualquier espacio, ya sea en la cocina, el baño, o el área de lavandería.\r\n\r\nMedidas:\r\n\r\nAltura: 20 cm\r\nDiámetro: 6 cm\r\n	4.99	https://i.ibb.co/vZLngdC/botella-500-dispensador.jpg	120	Limpieza	t
95	Esponja Mágica para Tapizados	Renueva y revitaliza tus muebles con la esponja mágica para tapizados. Esta esponja está diseñada especialmente para eliminar manchas difíciles en telas y superficies de tapicería, gracias a su composición de espuma melamina que actúa sin necesidad de productos químicos adicionales. Es ligera y ergonómica, perfecta para un uso prolongado sin cansancio.\r\n\r\nMedidas:\r\n\r\nLargo: 10 cm\r\nAncho: 7 cm\r\nGrosor: 2 cm	2.49	https://i.ibb.co/LkLf0F2/esponja-magica-para-tapizados-micro-magic.jpg	83	Limpieza	t
97	Set de Limpieza de Cocina Brushboo Eco	Cepillo de mango redondo para tazas y bols. Cepillo de mango ergonómico para frutas y verduras. Cepillo de mango largo para platos y sartenes. Cepillo de mango plano para sartenes y bandejas de horno. Cepillo de botella para botellas o rincones difíciles	12.99	https://i.ibb.co/cTLdDb3/Set-cocina1-Brushboo-web.jpg	47	Limpieza	t
99	Cesta de Mimbre para Ropa	Esta elegante cesta de mimbre es perfecta para almacenar ropa sucia o para organizar tu hogar. Con un diseño clásico y atemporal, se adapta a cualquier estilo de decoración. Su estructura resistente y liviana la hace fácil de mover, y el forro de tela interior ayuda a proteger la ropa de daños.\r\n\r\nMedidas:\r\n\r\nTamaño: 60 cm (altura) x 40 cm (diámetro)	29.99	https://i.ibb.co/3MK2LN0/cesta-mimbre-ropa.jpg	74	Organización Hogar	t
107	Set de Cajas de Oficina	Organiza tu oficina con este práctico set de cajas de oficina. Incluye tres cajas de diferentes tamaños, perfectas para almacenar documentos, suministros de escritorio o artículos personales. Cada caja está hecha de material resistente, con tapas que se ajustan perfectamente para proteger su contenido. Ideal para mantener todo en su lugar y reducir el desorden.\r\n\r\nMedidas:\r\n\r\nTamaños:\r\nCaja pequeña: 15 cm (alto) x 25 cm (ancho) x 20 cm (profundidad)\r\nCaja mediana: 20 cm (alto) x 30 cm (ancho) x 25 cm (profundidad)\r\nCaja grande: 25 cm (alto) x 35 cm (ancho) x 30 cm (profundidad)	25.95	https://i.ibb.co/bBc9DL6/set-cajas-oficina.jpg	15	Organización Oficina	t
\.


--
-- TOC entry 4923 (class 0 OID 16583)
-- Dependencies: 228
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provinces (provinces_id, provinces_name, provinces_cod) FROM stdin;
1	Albacete	2
2	Alicante/Alacant	3
3	Almería	4
4	Araba/Álava	1
5	Asturias	33
6	Ávila	5
7	Badajoz	6
8	Balears, Illes	7
9	Barcelona	8
10	Bizkaia	48
11	Burgos	9
12	Cáceres	10
13	Cádiz	11
14	Cantabria	39
15	Castellón/Castelló	12
16	Ceuta	51
17	Ciudad Real	13
18	Córdoba	14
19	Coruña, A	15
20	Cuenca	16
21	Gipuzkoa	20
22	Girona	17
23	Granada	18
24	Guadalajara	19
25	Huelva	21
26	Huesca	22
27	Jaén	23
28	León	24
29	Lugo	27
30	Lleida	25
31	Madrid	28
32	Málaga	29
33	Melilla	52
34	Murcia	30
35	Navarra	31
36	Ourense	32
37	Palencia	34
38	Palmas, Las	35
39	Pontevedra	36
40	Rioja, La	26
41	Salamanca	37
42	Santa Cruz de Tenerife	38
43	Segovia	40
44	Sevilla	41
45	Soria	42
46	Tarragona	43
47	Teruel	44
48	Toledo	45
49	Valencia/València	46
50	Valladolid	47
51	Zamora	49
52	Zaragoza	50
\.


--
-- TOC entry 4911 (class 0 OID 16420)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (users_id, users_name, users_lastname_one, users_lastname_two, users_email, users_role, users_password, users_is_active) FROM stdin;
9	Ainhoa	Alonso	Sánchez	ainhoa@ainhoa.com	admin	$2b$12$7gY8sHaXbrCDjJ6c5jgu9.Ba541C.CAjbEh3/A7Gy26kGcDugT7E.	t
24	admin	admin	admin	admin@admin.com	admin	$2b$12$VvMu5pcyhaHhSrEPw5gwXuJjaAjk0rNh2CiYWPgiKW32SSZltR4Dm	t
\.


--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 226
-- Name: customers_customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_customers_id_seq', 26, true);


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 225
-- Name: orderproducts_orderproducts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderproducts_orderproducts_id_seq', 22, true);


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 221
-- Name: orders_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_orders_id_seq', 24, true);


--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 217
-- Name: posts_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_posts_id_seq', 24, true);


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 219
-- Name: products_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_products_id_seq', 107, true);


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 227
-- Name: provinces_provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provinces_provinces_id_seq', 52, true);


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_users_id_seq', 24, true);


--
-- TOC entry 4753 (class 2606 OID 16573)
-- Name: customers customers_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email UNIQUE (customers_email) INCLUDE (customers_email);


--
-- TOC entry 4755 (class 2606 OID 16530)
-- Name: customers customers_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_id UNIQUE (customers_id) INCLUDE (customers_id);


--
-- TOC entry 4757 (class 2606 OID 16528)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customers_id);


--
-- TOC entry 4749 (class 2606 OID 16516)
-- Name: orderproducts orderproducts_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderproducts
    ADD CONSTRAINT orderproducts_id UNIQUE (orderproducts_id) INCLUDE (orderproducts_id);


--
-- TOC entry 4751 (class 2606 OID 16514)
-- Name: orderproducts orderproducts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderproducts
    ADD CONSTRAINT orderproducts_pkey PRIMARY KEY (orderproducts_id);


--
-- TOC entry 4743 (class 2606 OID 16487)
-- Name: orders orders_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_id UNIQUE (orders_id) INCLUDE (orders_id);


--
-- TOC entry 4745 (class 2606 OID 16537)
-- Name: orders orders_number; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_number UNIQUE (orders_number) INCLUDE (orders_number);


--
-- TOC entry 4747 (class 2606 OID 16485)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (orders_id);


--
-- TOC entry 4729 (class 2606 OID 16425)
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (users_id);


--
-- TOC entry 4735 (class 2606 OID 16449)
-- Name: posts posts_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_id UNIQUE (posts_id) INCLUDE (posts_id);


--
-- TOC entry 4737 (class 2606 OID 16442)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (posts_id);


--
-- TOC entry 4739 (class 2606 OID 16474)
-- Name: products products_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_id UNIQUE (products_id) INCLUDE (products_id);


--
-- TOC entry 4741 (class 2606 OID 16472)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (products_id);


--
-- TOC entry 4759 (class 2606 OID 16607)
-- Name: provinces provinces_cod; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_cod UNIQUE (provinces_cod) INCLUDE (provinces_cod);


--
-- TOC entry 4761 (class 2606 OID 16588)
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (provinces_id);


--
-- TOC entry 4731 (class 2606 OID 16453)
-- Name: users users_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email UNIQUE (users_email) INCLUDE (users_email);


--
-- TOC entry 4733 (class 2606 OID 16451)
-- Name: users users_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id UNIQUE (users_id) INCLUDE (users_id);


--
-- TOC entry 4727 (class 1259 OID 16427)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_users_email ON public.users USING btree (users_email);


--
-- TOC entry 4766 (class 2606 OID 16608)
-- Name: customers customers_provinces_cod; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_provinces_cod FOREIGN KEY (customers_provinces_cod) REFERENCES public.provinces(provinces_cod) NOT VALID;


--
-- TOC entry 4764 (class 2606 OID 16562)
-- Name: orderproducts orderproducts_orders_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderproducts
    ADD CONSTRAINT orderproducts_orders_id FOREIGN KEY (orderproducts_orders_id) REFERENCES public.orders(orders_id) NOT VALID;


--
-- TOC entry 4765 (class 2606 OID 16567)
-- Name: orderproducts orderproducts_products_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderproducts
    ADD CONSTRAINT orderproducts_products_id FOREIGN KEY (orderproducts_products_id) REFERENCES public.products(products_id) NOT VALID;


--
-- TOC entry 4763 (class 2606 OID 16557)
-- Name: orders orders_customers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customers_id FOREIGN KEY (orders_customers_id) REFERENCES public.customers(customers_id) NOT VALID;


--
-- TOC entry 4762 (class 2606 OID 16459)
-- Name: posts posts_users_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_users_id FOREIGN KEY (posts_users_id) REFERENCES public.users(users_id) NOT VALID;


-- Completed on 2024-10-09 20:19:18

--
-- PostgreSQL database dump complete
--


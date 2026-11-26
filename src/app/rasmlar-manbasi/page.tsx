/** Kurs kartalaridagi suratlar Wikimedia Commons'dan olingan: mualliflik ma'lumotlari (litsenziya talabi). */
const CREDITS = [
  { kurs: "6-sinf Botanika", nomi: "The Prayer - Young Fern Frond", muallif: "Sergio Boscaino", litsenziya: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:The_Prayer_-_Young_Fern_Frond_(26950828652).jpg" },
  { kurs: "7-sinf Zoologiya", nomi: "Axolotl ambystoma mexicanum anfibio ASAG", muallif: "Amandasofiarana", litsenziya: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Axolotl_ambystoma_mexicanum_anfibio_ASAG.jpg" },
  { kurs: "8-sinf Odam va uning salomatligi", nomi: "3D Male Skeleton Anatomy", muallif: "Bernhard Ungerer", litsenziya: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:3D_Male_Skeleton_Anatomy.png" },
  { kurs: "9-sinf Sitologiya asoslari", nomi: "Multicolor fluorescence image of a living HeLa cell", muallif: "8x57is", litsenziya: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Multicolor_fluorescence_image_of_a_living_HeLa_cell.jpg" },
  { kurs: "10-sinf Umumiy biologiya", nomi: "Mitotic LLC-PK1 cells, fluorescence microscopy", muallif: "ZEISS Microscopy", litsenziya: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Mitotic_LLC-PK1_cells,_fluorescence_microscopy_(23700644352).jpg" },
  { kurs: "11-sinf Biologiya", nomi: "Pez estandarte del mar Rojo (Heniochus intermedius)", muallif: "Diego Delso", litsenziya: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Pez_estandarte_del_mar_Rojo_(Heniochus_intermedius),_mar_Rojo,_Egipto,_2023-04-15,_DD_36.jpg" },
];

export const metadata = { title: "Rasmlar manbasi — Bio Academy" };

export default function Credits() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="page-title">Rasmlar manbasi</h1>
      <p className="text-slate-500">Kurs kartalaridagi suratlar Wikimedia Commons&apos;dan olingan va doira shaklida qirqilgan.</p>
      <ul className="card divide-y divide-line p-0">
        {CREDITS.map((c) => (
          <li key={c.kurs} className="px-5 py-4 text-sm">
            <p className="font-semibold text-slate-900">{c.kurs}</p>
            <p className="text-slate-600">
              <a href={c.url} target="_blank" rel="noreferrer" className="underline">{c.nomi}</a> · {c.muallif} · {c.litsenziya}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

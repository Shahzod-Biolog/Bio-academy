/** Kurs kartalaridagi suratlar Wikimedia Commons'dan olingan: mualliflik ma'lumotlari (litsenziya talabi). */
const CREDITS = [
  { kurs: "6-sinf Botanika", nomi: "Nelumbo nucifera (lotus)", muallif: "C T Johansson", litsenziya: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Nelumbo_nucifera-IMG_3511-1.jpg" },
  { kurs: "7-sinf Zoologiya", nomi: "Axolotl ambystoma mexicanum anfibio ASAG", muallif: "Amandasofiarana", litsenziya: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Axolotl_ambystoma_mexicanum_anfibio_ASAG.jpg" },
  { kurs: "8-sinf Odam va uning salomatligi", nomi: "Human skeleton at the Slovenian National Museum", muallif: "JIP", litsenziya: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Human_skeleton_at_the_Slovenian_National_Museum.jpg" },
  { kurs: "9-sinf Sitologiya asoslari", nomi: "Blausen 0208 CellAnatomy (yozuvlari olib tashlangan, fon o'zgartirilgan)", muallif: "BruceBlaus / Blausen Medical", litsenziya: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Blausen_0208_CellAnatomy.png" },
  { kurs: "10-sinf Umumiy biologiya", nomi: "Gene (yozuvlari o'zbekchaga o'girilgan)", muallif: "National Human Genome Research Institute", litsenziya: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Gene.png" },
  { kurs: "11-sinf Biologiya", nomi: "Herd of Zebra in Front of a Mountain", muallif: "Eric Kilby", litsenziya: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Herd_of_Zebra_in_Front_of_a_Mountain.jpg" },
  { kurs: "DNK (Masala darslari)", nomi: "DNA Helix CPK", muallif: "Ude", litsenziya: "Public domain", url: "https://commons.wikimedia.org/wiki/File:DNA_Helix_CPK.jpg" },
  { kurs: "ATF (Masala darslari)", nomi: "Adenosine-triphosphate-3D-spacefill", muallif: "Jynto", litsenziya: "CC0", url: "https://commons.wikimedia.org/wiki/File:Adenosine-triphosphate-3D-spacefill.png" },
];

export const metadata = { title: "Rasmlar manbasi — Bio Academy" };

export default function Credits() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="page-title">Rasmlar manbasi</h1>
      <p className="text-slate-500">Kurs kartalaridagi suratlar Wikimedia Commons&apos;dan olingan, doira shaklida qirqilgan va ba&apos;zilari birlashtirilgan.</p>
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

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';

export async function generateFromPptxTemplate(pptxBuffer: Buffer, data: Record<string, any>): Promise<Buffer> {
  const imageOpts = {
    centered: false,
    fileType: 'docx',
    getImage: (tagValue: string) => fetch(tagValue).then(r => r.arrayBuffer()).then(b => Buffer.from(b)),
    getSize: () => [200, 200],
  } as any;

  const zip = new PizZip(pptxBuffer);
  const doc = new Docxtemplater(zip, { modules: [new (ImageModule as any)(imageOpts)], paragraphLoop: true, linebreaks: true });
  doc.setData(data);
  try {
    doc.render();
  } catch (e) {
    throw e;
  }
  const out = doc.getZip().generate({ type: 'nodebuffer' });
  return out as Buffer;
}

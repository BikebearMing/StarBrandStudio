/**
 * Seeds the homepage content into Payload so the site renders from the CMS
 * identically to the original hardcoded design.
 *
 * Run:  npm run seed
 * Safe to re-run — media is matched by filename, the home page + footer are upserted.
 */
import path from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })

  const uploaded = new Map<string, number>()
  async function img(rel: string, alt = ''): Promise<number> {
    if (uploaded.has(rel)) return uploaded.get(rel)!
    const filename = path.basename(rel)
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })
    let id: number
    if (existing.docs[0]) {
      id = existing.docs[0].id as number
    } else {
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        filePath: path.resolve(process.cwd(), 'public', rel),
      })
      id = doc.id as number
      console.log(`  ↑ uploaded ${filename}`)
    }
    uploaded.set(rel, id)
    return id
  }

  console.log('Uploading media…')

  const carousel = [
    { rel: 'carousel/01-busan.jpg', brand: 'Train To Busan', copy: 'Resorts World Genting' },
    { rel: 'carousel/02-eq.png', brand: 'The Launch of EQ', copy: 'Mercedes-Benz' },
    { rel: 'carousel/03-mpoc.jpg', brand: 'The Sustainable Palm Oil Revolution', copy: 'Malaysian Palm Oil Council' },
    { rel: 'carousel/04-patek.jpg', brand: 'Timepiece of tradition', copy: "The origins of Patek Philippe's Calatrava wristwatch" },
    { rel: 'carousel/05-auchentoshan.jpg', brand: 'Auchentoshan', copy: 'The single malt whisky with a love for three' },
    { rel: 'carousel/06-jomsapot.jpg', brand: '#JomSapot BeliLokal Integrated Marketing Campaign' },
    { rel: 'carousel/07-elmina.jpg', brand: 'Elmina Rainforest Knowledge Centre Sustainability Campaign' },
    { rel: 'carousel/08-gamuda.png', brand: 'Gamuda Technology Website' },
  ]
  const logos = ['thestar.png', 'mstar.png', 'star-property.png', 'rage.png', 'kuntum.png', 'suria.png', '988.png']
  const awards = ['award1.png', 'award2.png', 'award3.png', 'award4.png', 'award5.png', 'awards-image-1.png']

  const carouselBlocks = []
  for (const c of carousel) {
    carouselBlocks.push({ image: await img(c.rel, c.brand), brand: c.brand, copy: c.copy })
  }
  const logoBlocks = []
  for (const l of logos) logoBlocks.push({ logo: await img(`logos/${l}`) })
  const awardBlocks = []
  for (const a of awards) awardBlocks.push({ image: await img(a) })

  const inlineLogo = await img('SMG_Logo-Loop-Animation.gif', 'SMG')
  const gucciThumb = await img('gucci.png', 'Gucci')
  const nikeThumb = await img('nikethumb.png', 'Nike')
  const snickersThumb = await img('snickers.png', 'Snickers')
  const mcdThumb = await img('mcdonalds.png', "McDonald's")
  const eqThumb = await img('carousel/02-eq.png', 'Mercedes-Benz EQ')
  const busanThumb = await img('carousel/01-busan.jpg', 'Train To Busan')
  const worksBg = await img('works-bg.png', 'Works')
  const brandLogo = await img('footer/smg-brand-studio.png', 'SMG Brand Studio')
  const fbIcon = await img('footer/facebook.svg', 'Facebook')
  const igIcon = await img('footer/instagram.svg', 'Instagram')

  console.log('Building home layout…')

  const layout = [
    {
      blockType: 'hero',
      headingLine1: 'A FULL SUITE OF',
      headingLine2: 'SERVICES',
      subheading: 'BUILT FOR BRANDS THAT WANT TO',
      typewriterWords: ['LEAD', 'INSPIRE', 'SELL', 'GROW'].map((word) => ({ word })),
      carousel: carouselBlocks,
    },
    {
      blockType: 'whatWeDo',
      label: 'WHAT WE DO',
      headingBefore:
        'Across every platform—digital, radio, on-ground, print and social—we bring brand',
      inlineLogo,
      headingAfter: 'ideas to life, creating moments that spark connection and inspire action.',
      showreelUrl: 'https://streamable.com/l/q9wy22/mp4.mp4',
      showreelThumbnail: 'https://streamable.com/l/q9wy22/mp4.mp4',
    },
    {
      blockType: 'pillars',
      heading: 'ROOTED IN AUDIENCE INSIGHTS AND \nCREDIBLE JOURNALISM, WE DELIVER :',
      items: [
        { label: 'CREDIBILITY', copy: 'We bring editorial authority to your brand, built on decades of trusted journalism. Our newsroom experience shapes how we research, question, and craft stories with clarity and integrity.' },
        { label: 'TRUSTED IMPACT', copy: 'Where credibility meets creativity. We don’t just tell stories—we deliver content that informs, engages, and moves audiences to action.' },
        { label: 'AUDIENCE-CENTRIC\nCREATIVITY', copy: 'Creativity grounded in data, culture, and human insight. We combine audience understanding with multimedia storytelling to produce content that captures attention and builds trust.' },
      ],
    },
    { blockType: 'logos', items: logoBlocks },
    {
      blockType: 'awards',
      title: 'AWARDS',
      buttonLabel: 'VIEW ALL AWARDS',
      caption: 'AWARD-WINNING IDEAS \nGROUNDED IN GOOD\nSTORYTELLING',
      recognitions: '& RECOGNITIONS',
      items: awardBlocks,
    },
    {
      blockType: 'projects',
      headingBefore: 'FEATURED',
      headingHighlight: 'PROJECTS',
      items: [
        { key: 'gucci', title: 'GUCCI WALK YOUR WAY', year: '2025', thumbnail: gucciThumb, hoverVideoUrl: 'https://streamable.com/l/ulxzt8/mp4.mp4', copy: 'A FASHION-FORWARD CAMPAIGN CELEBRATING SELF-EXPRESSION THROUGH WALKING, BLENDING ICONIC HOUSE CODES WITH STREET CULTURE.', tags: [{ tag: 'FASHION' }, { tag: 'BRAND FILM' }] },
        { key: 'nike', title: 'NIKE EVERYTHING IS POSSIBLE', year: '2025', thumbnail: nikeThumb, hoverVideoUrl: 'https://streamable.com/l/xx3sll/mp4-high.mp4', copy: "A BOLD MANIFESTO PROVING THAT NO LIMIT IS FIXED — TURNING ATHLETES' DOUBT INTO PROOF THROUGH UNFLINCHING STORYTELLING.", tags: [{ tag: 'SPORTS' }, { tag: 'VIDEO PRODUCTION & MEDIA' }] },
        { key: 'snickers', title: "SNICKERS YOU'RE NOT YOU WHEN YOU'RE HUNGRY", year: '2025', thumbnail: snickersThumb, copy: 'A WITTY INTEGRATED CAMPAIGN LEANING INTO THE INSIGHT THAT HUNGER CHANGES WHO YOU ARE — BUILT FOR SOCIAL AND OUT-OF-HOME.', tags: [{ tag: 'FMCG' }, { tag: 'INTEGRATED CAMPAIGN' }] },
        { key: 'mcdonalds', title: "MCDONALD'S I'M LOVIN' IT", year: '2025', thumbnail: mcdThumb, copy: 'AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.', tags: [{ tag: 'F&B' }, { tag: 'DIGITAL & SOCIAL' }] },
      ],
    },
    {
      blockType: 'services',
      items: [
        { title: 'INTEGRATED MARKETING & CREATIVE STRATEGY', copy: 'By connecting strategy, storytelling, and media across platforms, we create campaigns that reach the right audiences and deliver results for your brand.' },
        { title: 'EDITORIAL STORYTELLING', copy: 'We craft narratives with the discipline of journalism and the impact of great creative.' },
        { title: 'VIDEO & MULTIMEDIA PRODUCTION', copy: 'From short-form social cuts to long-form documentary, we produce video content that conveys the brand message with clarity and craft.' },
        { title: 'YOUTH & SOCIAL IMPACT PROGRAMME', copy: 'We design programmes that engage young audiences around causes that matter through meaningful partnerships.' },
        { title: 'RESEARCH & INSIGHTS', copy: 'Quantitative rigour meets qualitative depth. We uncover the audience truths that shape sharper strategy and more resonant creative work.' },
        { title: 'SOCIAL MEDIA & INFLUENCER ENGAGEMENT', copy: 'We manage always-on presence and hand-picked creator partnerships as a single integrated system — brand voice, community, and earned attention in lockstep.' },
        { title: 'DIGITAL EXPERIENCES', copy: 'Websites, apps, interactive campaigns. We design and build digital products that carry the same narrative discipline as editorial work.' },
        { title: 'MEDIA STRATEGY & BUYING', copy: 'Data-led planning across paid, owned and earned — designed to put the right message in front of the right people at the moment it matters.' },
      ],
    },
  ]

  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  if (existingHome.docs[0]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: 'pages', id: existingHome.docs[0].id, data: { title: 'Home', layout: layout as any } })
    console.log('Updated existing home page.')
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'pages', data: { title: 'Home', slug: 'home', layout: layout as any } })
    console.log('Created home page.')
  }

  console.log('Setting footer global…')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      address:
        'Menara Star, 15, Jalan 16/11, Seksyen 16, 46350 Petaling Jaya, Selangor Darul Ehsan, Malaysia',
      phones: [{ number: '+603 7967 1388' }, { number: '+60126429027' }],
      directory: [
        { label: 'OUR STORY', href: '/about' },
        { label: 'WORKS', href: '/works' },
        { label: 'SERVICES', href: '/services' },
        { label: 'AWARDS', href: '/awards' },
        { label: 'CONTACT', href: '/contact' },
      ],
      updatesLabel: 'GET THE LATEST UPDATES',
      socials: [
        { label: 'Facebook', href: '#', icon: fbIcon },
        { label: 'Instagram', href: '#', icon: igIcon },
      ],
      brandLogo,
      copyright: 'Copyrights © of Star Media Group 2026',
      email: 'SMGBRANDSTUDIO@THESTAR.COM.MY',
    },
  })

  console.log('Setting awards page global…')
  await payload.updateGlobal({
    slug: 'awardsPage',
    data: {
      eyebrow: 'AWARDS',
      heading: 'AWARD-WINNING IDEAS\nGROUNDED IN GOOD STORYTELLING',
      years: [
        {
          year: '2025',
          entries: [
            {
              organization: 'MDA D-AWARDS 2025',
              award: 'DIGITAL PUBLISHER OF THE YEAR – SILVER',
              campaign: 'THE STAR ESG: BRIDGING ESG KNOWLEDGE INTO ACTION',
            },
            {
              organization: 'WASTE MANAGEMENT ASSOCIATION OF MALAYSIA (WMAM)',
              award: 'GREEN JOURNALISM AWARD',
              campaign: 'THE STAR ESG PUBLICATION',
            },
          ],
        },
        {
          year: '2024',
          entries: [
            {
              organization: 'WAN-IFRA DIGITAL MEDIA AWARDS ASIA 2024',
              award: 'BEST USE OF AI IN REVENUE STRATEGY – SILVER',
              campaign: '#JOMSAPOT BELILOKAL GEN AI-LED INTEGRATED MARKETING CAMPAIGN',
            },
            {
              organization: 'MDA D-AWARDS 2024',
              award: 'BEST B2B MARKETING CAMPAIGN - SILVER',
              campaign: '#JOMSAPOT BELILOKAL GEN AI- LED INTERGRATED MARKETING CAMPAIGN',
            },
            {
              organization: 'MDA D-AWARDS 2024',
              award: 'BEST USE OF DIGITAL MARKETING INNOVATION - SILVER',
              campaign: '#JOMSAPOT BELILOKAL GEN AI- LED INTEGRATED MARKETING CAMPAIGN',
            },
            {
              organization: 'PMAA DRAGONS OF ASIA 2024',
              award: 'BEST DIGITAL CAMPAIGN 2024 – BRONZE',
              campaign: '#JOMSAPOT BELILOKAL GEN AI-LED INTERGRATED MARKETING CAMPAIGN',
            },
            {
              organization: 'PMAA DRAGONS OF MALAYSIA 2024',
              award: 'BEST DIGITAL CAMPAIGN 2024 - GOLD',
              campaign: '#JOMSAPOT BELILOKAL GEN AI- LED INTERGRATED MARKETING CAMPAIGN',
            },
          ],
        },
        {
          year: '2023',
          entries: [
            {
              organization: 'WAN-IFRA ASIAN DIGITAL MEDIA AWARDS (ADMA) 2023',
              award: 'BEST NATIVE ADVERTISING/SPONSORED CONTENT CAMPAIGN GOLD',
              campaign:
                'SIME DARBY PROPERTY – ELMINA RAINFOREST KNOWLEDGE CETRE (ERKC) SUSTAINABILITY CAMPAIGN',
            },
          ],
        },
      ],
    },
  })

  console.log('Seeding works collection…')
  // Each project is its own document in the `works` collection (a custom-post-type
  // style). They render in the order created here; editors can drag to reorder in
  // the admin (the collection is `orderable`). Idempotent — matched by slug.
  const works = [
    {
      slug: 'gucci',
      image: gucciThumb,
      title: 'GUCCI WALK YOUR WAY',
      year: '2025',
      description:
        'A FASHION-FORWARD CAMPAIGN CELEBRATING SELF-EXPRESSION THROUGH WALKING, BLENDING ICONIC HOUSE CODES WITH STREET CULTURE.',
      tags: [{ label: 'FASHION' }, { label: 'BRAND FILM' }],
      content: [
        {
          blockType: 'textSection',
          heading: 'Project Brief',
          body: 'Gucci wanted to reintroduce its heritage to a younger, culturally fluent audience without losing the prestige that defines the house. The brief: turn the simple act of walking into a statement of individuality that felt unmistakably Gucci.',
        },
        { blockType: 'twoImages', left: busanThumb, right: eqThumb },
        {
          blockType: 'textSection',
          heading: 'The Solution',
          body: 'We built an integrated brand film and social campaign around the idea that every walk tells a story. Shot across the streets of three cities, the work paired archival house motifs with contemporary street styling, then extended into a series of short, platform-native cuts for TikTok and Reels.',
        },
        {
          blockType: 'textSection',
          heading: 'Impact & Results',
          body: 'The campaign drove a 38% lift in brand search and over 24 million organic video views in its first month, with the hero film outperforming the previous season’s launch by 2.1x on engagement.',
        },
        { blockType: 'oneImage', image: worksBg },
      ],
    },
    {
      slug: 'nike',
      image: nikeThumb,
      title: 'NIKE EVERYTHING IS POSSIBLE',
      year: '2025',
      description:
        "A BOLD MANIFESTO PROVING THAT NO LIMIT IS FIXED — TURNING ATHLETES' DOUBT INTO PROOF THROUGH UNFLINCHING STORYTELLING.",
      tags: [{ label: 'SPORTS' }, { label: 'VIDEO PRODUCTION & MEDIA' }],
      content: [
        {
          blockType: 'textSection',
          heading: 'Project Brief',
          body: 'Nike asked us to reignite the brand’s founding belief — that limits exist only to be broken — for a generation of athletes who have heard every motivational slogan before. The work needed to feel earned, not preached.',
        },
        { blockType: 'twoImages', left: eqThumb, right: busanThumb },
        {
          blockType: 'textSection',
          heading: 'The Solution',
          body: 'We followed real athletes through the moments most campaigns leave out: the failed attempts, the rehab, the early mornings. The result was a documentary-style hero film and a paid media plan built to surface each athlete’s story to the audiences who shared their sport.',
        },
        {
          blockType: 'textSection',
          heading: 'Impact & Results',
          body: 'The film reached 41 million people across paid and earned channels, lifted purchase intent by 17 points among 18–24s, and became Nike Malaysia’s most-shared piece of the year.',
        },
        { blockType: 'oneImage', image: worksBg },
      ],
    },
    {
      slug: 'snickers',
      image: snickersThumb,
      title: "SNICKERS YOU'RE NOT YOU WHEN YOU'RE HUNGRY",
      year: '2025',
      description:
        'A WITTY INTEGRATED CAMPAIGN LEANING INTO THE INSIGHT THAT HUNGER CHANGES WHO YOU ARE — BUILT FOR SOCIAL AND OUT-OF-HOME.',
      tags: [{ label: 'FMCG' }, { label: 'INTEGRATED CAMPAIGN' }],
      content: [
        {
          blockType: 'textSection',
          heading: 'Project Brief',
          body: 'Snickers wanted to localise its globally recognised platform for a Malaysian audience while keeping the humour sharp and the message instantly readable on a billboard or a six-second pre-roll.',
        },
        { blockType: 'twoImages', left: busanThumb, right: eqThumb },
        {
          blockType: 'textSection',
          heading: 'The Solution',
          body: 'We cast familiar local “hangry” personas and built a flexible toolkit of out-of-home, social, and influencer content that all paid off the same punchline. Each execution worked standalone but compounded when seen in sequence across a commuter’s day.',
        },
        {
          blockType: 'textSection',
          heading: 'Impact & Results',
          body: 'The campaign delivered a 12% sales uplift over the promotional period and a 3.4x return on media spend, with the OOH executions earning unprompted social re-shares.',
        },
        { blockType: 'oneImage', image: worksBg },
      ],
    },
    {
      slug: 'mcdonalds',
      image: mcdThumb,
      title: "MCDONALD'S I'M LOVIN' IT",
      year: '2025',
      description:
        'AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.',
      tags: [{ label: 'F&B' }, { label: 'DIGITAL & SOCIAL' }],
      content: [
        {
          blockType: 'textSection',
          heading: 'Project Brief',
          body: "McDonald's needed to keep its always-on platform feeling fresh and culturally present, turning everyday menu moments into reasons for audiences to engage and advocate.",
        },
        { blockType: 'twoImages', left: eqThumb, right: busanThumb },
        {
          blockType: 'textSection',
          heading: 'The Solution',
          body: 'We designed an always-on content engine that reacted to local conversations in near real time, supported by hero seasonal films and a creator programme that put the brand into authentic, everyday contexts.',
        },
        {
          blockType: 'textSection',
          heading: 'Impact & Results',
          body: 'The programme grew social engagement by 56% year on year and generated a sustained lift in consideration among families, the campaign’s priority audience.',
        },
        { blockType: 'oneImage', image: worksBg },
      ],
    },
    {
      slug: 'mercedes-eq',
      image: eqThumb,
      title: 'THE LAUNCH OF EQ',
      year: '2024',
      description:
        'A PREMIUM LAUNCH CAMPAIGN INTRODUCING MERCEDES-BENZ’S ALL-ELECTRIC EQ RANGE TO A NEW GENERATION OF DRIVERS.',
      tags: [{ label: 'AUTOMOTIVE' }, { label: 'INTEGRATED CAMPAIGN' }],
      content: [
        {
          blockType: 'textSection',
          heading: 'Project Brief',
          body: 'Mercedes-Benz was entering the electric category against fast-moving challengers. The launch needed to assert that going electric meant no compromise on the luxury the brand is known for.',
        },
        { blockType: 'twoImages', left: busanThumb, right: gucciThumb },
        {
          blockType: 'textSection',
          heading: 'The Solution',
          body: 'We framed EQ as “the future, perfected” — a multi-channel launch spanning editorial partnerships, experiential test-drive events, and a digital configurator that let prospects build their own EQ.',
        },
        {
          blockType: 'textSection',
          heading: 'Impact & Results',
          body: 'The launch generated 9,200 qualified test-drive leads and positioned EQ as the most-considered premium EV in market within its first quarter.',
        },
        { blockType: 'oneImage', image: worksBg },
      ],
    },
    {
      slug: 'train-to-busan',
      image: busanThumb,
      title: 'TRAIN TO BUSAN',
      year: '2024',
      description:
        'AN IMMERSIVE ENTERTAINMENT ACTIVATION BRINGING THE WORLD OF TRAIN TO BUSAN TO LIFE AT RESORTS WORLD GENTING.',
      tags: [{ label: 'ENTERTAINMENT' }, { label: 'EXPERIENTIAL' }],
      content: [
        {
          blockType: 'textSection',
          heading: 'Project Brief',
          body: 'Resorts World Genting wanted a tentpole attraction that would drive footfall and dominate social feeds by turning a beloved film franchise into a physical, shareable experience.',
        },
        { blockType: 'twoImages', left: gucciThumb, right: eqThumb },
        {
          blockType: 'textSection',
          heading: 'The Solution',
          body: 'We designed an end-to-end immersive walkthrough, supported by a teaser content series, influencer previews, and a ticketing-integrated social campaign that built anticipation ahead of opening.',
        },
        {
          blockType: 'textSection',
          heading: 'Impact & Results',
          body: 'The activation sold out its opening weeks, drove a measurable spike in resort visitation, and earned widespread organic coverage across entertainment media.',
        },
        { blockType: 'oneImage', image: worksBg },
      ],
    },
  ]

  for (const work of works) {
    const existing = await payload.find({
      collection: 'works',
      where: { slug: { equals: work.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.update({ collection: 'works', id: existing.docs[0].id, data: work as any })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection: 'works', data: work as any })
    }
    console.log(`  ✓ ${work.slug}`)
  }

  console.log('Setting up contact form…')

  // Minimal Lexical rich-text value for the confirmation message.
  const lexical = (text: string) => ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
          ],
        },
      ],
    },
  })

  const contactFormData = {
    title: 'Contact',
    submitButtonLabel: 'Submit',
    confirmationType: 'message' as const,
    confirmationMessage: lexical("Thanks — we've got your enquiry. We'll be in touch shortly."),
    // NOTE: email notifications are intentionally left empty until SMTP details exist.
    // Once an email adapter is configured in payload.config.ts, add entries here.
    emails: [],
    fields: [
      { blockType: 'text', name: 'fullName', label: 'Full Name', required: true, width: 100 },
      { blockType: 'text', name: 'company', label: 'Company / Organisation', required: false, width: 100 },
      { blockType: 'email', name: 'email', label: 'Email Address', required: true, width: 50 },
      { blockType: 'text', name: 'phone', label: 'Phone Number', required: false, width: 50 },
      {
        blockType: 'select',
        name: 'services',
        label: 'What Services Are Required?',
        required: false,
        width: 100,
        options: [
          { label: 'Integrated Marketing & Creative Strategy', value: 'integrated-marketing' },
          { label: 'Editorial Storytelling', value: 'editorial-storytelling' },
          { label: 'Video & Multimedia Production', value: 'video-production' },
          { label: 'Youth & Social Impact Programme', value: 'social-impact' },
          { label: 'Research & Insights', value: 'research-insights' },
          { label: 'Social Media & Influencer Engagement', value: 'social-influencer' },
          { label: 'Digital Experiences', value: 'digital-experiences' },
          { label: 'Media Strategy & Buying', value: 'media-strategy' },
          { label: 'Other', value: 'other' },
        ],
      },
      { blockType: 'textarea', name: 'enquiry', label: 'Leave Your Project Enquiry', required: false, width: 100 },
    ],
  }

  const existingForm = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact' } },
    limit: 1,
  })
  if (existingForm.docs[0]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: 'forms', id: existingForm.docs[0].id, data: contactFormData as any })
    console.log('Updated existing contact form.')
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'forms', data: contactFormData as any })
    console.log('Created contact form.')
  }

  console.log('✅ Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

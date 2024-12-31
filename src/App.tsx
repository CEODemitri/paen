import "./App.css";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  // script things here
   const places = ['Mars', 'Jupiter', 'Venus'];
  
    return (
    <>
      <div className="flex flex-col gap-20 mb-40">
        <article>
          <Badge variant="outline" className="my-8">Twinkle Twinkle little staer</Badge>
          <section className="flex justify-between">
            <h1 className="text-4xl font-extrabold lg:text-5xl">
              Explore the Bigger Earth
            </h1>
            <p className="w-2/5 text-justify">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi
              consequatur voluptate, aperiam perspiciatis quos mollitia fugiat?
              Deserunt, ipsa dolor mollitia accusamus nesciunt porro quia totam,
              ducimus voluptatibus inventore, saepe fugiat.
            </p>
          </section>
        </article>
        <div className="image w-full h-60 bg-black rounded-md"></div>
                <div className="flex w-full mx-auto max-w-md">
          <Input type="text" placeholder="topic" />
          <Button type="submit">Search</Button>
        </div>
      </div>

      {/* services */}
      <div>
        <article className="mb-20">
          <h2 className="m-8 text-3xl tracking-wider uppercase font-bold underline">Particular Places</h2>
          <div className="h-[500px] grid grid-cols-12 grid-rows-12 gap-12">
            <section className="col-start-1 col-span-3 row-start-2 row-span-11 flex flex-col gap-8">
              <div className="img bg-black w-full h-1/2"></div>
              <div className="img bg-black w-full h-1/2"></div>
            </section>

            <section className="col-start-4 col-span-5 row-start-1 row-span-full bg-red-400 flex">
              <p className="my-auto vert-text">Decorate Text</p>
              <div className="flex flex-col gap-8">
                {/* <img src="" alt="" /> */}
                <div className="img bg-black ml-auto w-5/6 h-3/5"></div>
                <p className="text-justify">
                  Officia aliquid in ut alias quaerat corrupti laboriosam,
                  explicabo cupiditate dolores inventore totam fugiat eos,
                  consequatur rerum iure incidunt deleniti minima sunt. Iusto
                  quas voluptatum exercitationem ducimus consectetur officia quo
                  sunt mollitia a ipsum, repellendus fugit nihil eaque ad
                  voluptatem vel! Officiis, quibusdam vel?
                </p>
              </div>
            </section>

            <section className="col-start-9 col-span-full row-start-1 row-span-full bg-red-400 flex flex-col justify-center gap-8">
              <p className="text-justify">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error
                sed adipisci, maiores illo tempore eligendi a molestiae ipsum
                amet, mollitia reprehenderit? Ratione eum numquam atque
                consectetur totam nobis, obcaecati laborum.
              </p>
              <div className="img bg-black w-5/6 h-3/5"></div>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}

export default App;

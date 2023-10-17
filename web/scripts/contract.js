class Contract {
    constructor(parent, x, y, width, height) {
        this._id = Date.now();
        this._parent = parent;

        this.group = parent.group();

        const container = this.group.foreignObject(width, height).move(x, y).addClass("contract-container");

        // add decorator div

        const top_dec = document.createElement("img");
        top_dec.src = "/resources/floral-divider.svg";
        top_dec.classList.add("contract-decorator");
        container.add(SVG(top_dec));

        function add_text(text) {
            const content = document.createElement("p");
            content.textContent = text;
            container.add(SVG(content));
        }

        add_text(
            "The establishment of a stable, nurturing, and fulfilling relationship requires the incorporation of certain fundamental principles and guidelines. This Relationship Charter is formulated to foster a loving, healthy, and resilient bond between Meena Kittikunsiri and Chatavut Viriyasuthee, grounded in the spirit of mutual trust, support, and respect. Recognizing the vitality of these core principles, this charter is intended to act as a foundational stone upon which our relationship is built and nurtured."
        );

        add_text("We vow to communicate our feelings, intentions, and concerns openly and honestly.");

        add_text("We pledge to be faithful to each other, both emotionally and physically.");

        add_text("We shall exhibit consistency in our actions to ensure stability and predictability in our relationship.");

        add_text("We commit to being each other's pillar, providing consolation during tough times and celebrating triumphs together.");

        add_text("We shall cheer each other on, providing positive reinforcement and encouragement in all endeavors.");

        add_text("We will advocate for each other's dreams and aspirations, providing a stable platform for individual and mutual growth.");

        add_text("We will accept each other wholeheartedly, without pressuring one another to change intrinsic characteristics.");

        add_text("We shall discuss and agree upon expectations, ensuring they are realistic and mutually acceptable.");

        add_text("We will not take each other for granted and will continuously express our appreciation both verbally and through actions.");

        const bot_dec = document.createElement("img");
        bot_dec.src = "/resources/floral-divider.svg";
        bot_dec.classList.add("contract-decorator");
        container.add(SVG(bot_dec));
    }
}

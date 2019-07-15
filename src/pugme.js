// Description:
//   Pugme is the most important thing in life
//
// Configuration:
//   None
//
// Commands:
//   hubot pug me - Receive a pug
//   hubot pug bomb N - Get N pugs

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = function (robot) {
  robot.respond(/pug me|pug bomb( (\d+))?/i, function(msg) {
    let count = msg.match[2];
    if (!count) {
      count = ((msg.match.input.match(/bomb/i)) != null) ? 5 : 1;
    }

    return robot.http("https://www.reddit.com/r/pugs.json?sort=top&t=week")
    .get()(function(err, res, body) {
      let pugs;
      try {
        pugs = getPugs(body, count);
      } catch (error) {
        robot.logger.error(`[pugme] ${error}`);
        msg.send(`I'm brain damaged :( ${error}`);
        return;
      }

      return pugs.map((pug) => msg.send(pug));
    });
  })
}

var getPugs = function(response, n) {
  let posts;
  try {
    posts = JSON.parse(response);
  } catch (error) {
    throw new Error("JSON parse failed");
  }

  if (((posts.data != null ? posts.data.children : undefined) == null) || !(posts.data.children.length > 0)) {
    throw new Error("Could not find any posts");
  }

  const imagePosts = posts.data.children.filter(child => !child.data.is_self).map(imagePost => imagePost.data.url.replace('http://', 'https://'));

  if (n > imagePosts.length) {
    n = imagePosts.length;
  }

  return shuffle(imagePosts).slice(0, n);
};

FROM quay.io/konveyor/move2kube-website-base:v0.3.5
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
RUN yarn run build && yarn run bundle
EXPOSE 4000
CMD [ "bundle", "exec", "jekyll", "serve", "--host=0.0.0.0", "--incremental"]
